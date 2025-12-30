'use client';

import { useRef } from 'react';
import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor.css';
import { createClient } from '@supabase/supabase-js';

// Supabase 클라이언트
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  initialValue?: string;
  onChange: (value: string) => void;
}

export default function ToastEditorWrapper({ initialValue, onChange }: Props) {
  const editorRef = useRef<Editor>(null);

  const handleChange = () => {
    if (editorRef.current) {
      const instance = editorRef.current.getInstance();
      onChange(instance.getHTML());
    }
  };

  // [핵심] 이미지 업로드 로직 (Supabase 'uploads' 버킷 연동)
  const onAddImageBlob = async (blob: Blob | File, callback: (url: string, altText: string) => void) => {
    try {
      const file = blob as File;
      // 파일명 한글 깨짐 방지 및 고유화
      const fileName = `editor/${Date.now()}_${Math.random().toString(36).substring(2)}`;

      // 1. Supabase Storage에 업로드 (버킷명: 'uploads')
      const { error: uploadError } = await supabase.storage
        .from('uploads') 
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // 2. 공개 URL 가져오기
      const { data } = supabase.storage
        .from('uploads')
        .getPublicUrl(fileName);

      // 3. 에디터에 이미지 삽입
      callback(data.publicUrl, 'image');

    } catch (error) {
      console.error('이미지 업로드 실패:', error);
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  return (
    <Editor
      ref={editorRef}
      initialValue={initialValue || '내용을 입력하세요.'}
      previewStyle="vertical"
      height="500px"
      initialEditType="wysiwyg"
      useCommandShortcut={true}
      onChange={handleChange}
      hooks={{
        addImageBlobHook: onAddImageBlob, // 훅 연결
      }}
      toolbarItems={[
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock']
      ]}
    />
  );
}