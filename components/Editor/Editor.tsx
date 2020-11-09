import React, { createRef, useEffect, useState } from "react";
import { Button, Spin } from "antd";
import SimpleMDE from "simplemde";
import sendRequest from "../../utils/sendRequest";
import { IPostDetail } from "../../dataStructures";


export interface IOnFinishArgs {
  title: string;
  description: string;
  content: string;
  tags: string;
}

interface IEditorProps {
  id: string;
  loadData: boolean;
  onFinish: (arg0: IOnFinishArgs) => void;
}


export default function Editor({ id, loadData, onFinish }: IEditorProps) {
  const mdEditorRef = createRef<HTMLTextAreaElement>();
  const [mdEditor, setMdEditor] = useState<SimpleMDE>();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');

  async function loadDetail() {
    const data = await sendRequest<IPostDetail>({
      url: 'get_post',
      method: 'POST',
      body: { id }
    });
    setLoading(false);
  }


  useEffect(() => {
    new SimpleMDE({
      element: mdEditorRef.current!
    });

    if (loadData) {
      loadDetail();
    } else {
      setLoading(false);
    }
  }, []);


  const MainComponent =
    (
      <div style={ { display: loading ? 'none' : '' } }>
        <Button type={ "primary" }>完成</Button>
        <input type="text" value={ title } onChange={ (e) => {
          setTitle(e.target.value);
        } }/>
        <textarea name="description" value={ description } onChange={ (e) => {
          setDescription(e.target.value);
        } }/>
        <textarea ref={ mdEditorRef }/>
      </div>
    );

  const LoadComponent =
    (
      <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center' } }>
        <Spin size={ "large" } tip={ '加载中...' }/>
      </div>
    );


  return (
    <div>
      { loading ? LoadComponent : null }
      { MainComponent }
    </div>
  );
}
