'use client';

import { Viewer } from '@toast-ui/react-editor';
import '@toast-ui/editor/dist/toastui-editor-viewer.css';

interface Props {
  content: string;
}

export default function TuiViewerWrapper({ content }: Props) {
  return <Viewer initialValue={content || ''} />;
}