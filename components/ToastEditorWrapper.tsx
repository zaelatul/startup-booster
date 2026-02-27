'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';

export default function ToastEditorWrapper({
  initialValue,
  onChange,
  height = '400px',
}: {
  initialValue?: string;
  onChange?: (value: string) => void;
  height?: string;
}) {
  const editorRef = useRef<Editor>(null);
  const [ready, setReady] = useState(false);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  const supabase = useMemo(
    () =>
      createBrowserClient(
        supabaseUrl || 'https://placeholder.supabase.co',
        supabaseAnonKey || 'placeholder-key'
      ),
    [supabaseUrl, supabaseAnonKey]
  );

  useEffect(() => {
    setReady(true);
  }, []);

  const uploadImage = async (file: File) => {
    // ✅ env 없으면 업로드 자체를 막고, 에디터는 정상 동작
    if (!supabaseUrl || !supabaseAnonKey) {
      alert('Supabase 환경변수가 설정되지 않아 이미지 업로드를 진행할 수 없습니다.');
      return '';
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `magazine/${fileName}`;

    const { error } = await supabase.storage.from('images').upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (error) {
      console.error('이미지 업로드 실패:', error);
      return '';
    }

    const { data } = supabase.storage.from('images').getPublicUrl(filePath);
    return data.publicUrl;
  };

  if (!ready) return null;

  return (
    <Editor
      ref={editorRef}
      initialValue={initialValue || ''}
      previewStyle="vertical"
      height={height}
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      hooks={{
        addImageBlobHook: async (blob, callback) => {
          const url = await uploadImage(blob as File);
          if (url) callback(url, 'image');
        },
      }}
      onChange={() => {
        const instance = editorRef.current?.getInstance();
        const markdown = instance?.getMarkdown() || '';
        onChange?.(markdown);
      }}
    />
  );
}
