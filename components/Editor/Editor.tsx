import React, { createRef, useEffect, useState } from "react";
import { Button, message, Spin } from "antd";
import SimpleMDE from "simplemde";
import sendRequest from "../../utils/sendRequest";
import { IPostDetail } from "../../dataStructures";
import style from './Editor.module.scss';
import TagGroup from "../TagGroup/TagGroup";


export interface IOnFinishArgs {
  title: string;
  description: string;
  content: string;
  tags: string;
}

interface IEditorProps {
  id: string;
  loadData: boolean;
  onFinish: (arg0: IOnFinishArgs) => Promise<void>;
  onCancel: () => void;
}


export default function Editor({ id, loadData, onFinish, onCancel }: IEditorProps) {
  const mdEditorRef = createRef<HTMLTextAreaElement>();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  async function loadDetail() {
    const data = await sendRequest<IPostDetail>({
      url: 'get_post',
      method: 'POST',
      body: { id }
    });
    if (data) {
      setTitle(data.title);
      setDescription(data.description);
      setContent(data.content);
      setTags(data.tags.split(' '));
    } else {
      message.error('加载失败', 5);
    }
    setLoading(false);
  }


  useEffect(() => {
    if (loadData) {
      loadDetail();
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      const mde = new SimpleMDE({
        element: mdEditorRef.current!,
        initialValue: content,
        forceSync: true,
      });
      mde.codemirror.on('change', () => {
        setContent(mde.value());
      });
    }
  }, [loading]);


  async function handleSave() {
    await onFinish({
      title,
      description,
      tags: tags.join(' '),
      content
    });
  }


  const MainComponent =
    (
      <div className={ style.MainComponent } style={ { display: loading ? 'none' : 'block' } }>
        <div className={ style.centerContent }>
          <input className={ style.titleInput }
                 placeholder={ '标题' }
                 type="text"
                 value={ title }
                 onChange={ (e) => setTitle(e.target.value) }
          />
        </div>
        <div className={ style.centerContent }>
          <textarea name="description"
                    className={ style.descriptionInput }
                    value={ description }
                    onChange={ (e) => setDescription(e.target.value) }
          />
        </div>
        <div className={ style.tagContainer }>
          <TagGroup initTags={ tags }/>
        </div>
        <div className={ style.editorContainer }>
          <textarea style={ { height: '100%' } }
                    ref={ mdEditorRef }
                    value={ content }
                    onChange={ (e) => setContent(e.target.value) }/>
        </div>
        <div className={ style.actionBar }>
          <Button size={ "small" } onClick={ onCancel }>不保存退出</Button>
          <Button size={ "small" } type={ "primary" } onClick={ handleSave }>保存</Button>
        </div>
      </div>
    );

  const LoadComponent =
    (
      <div style={ { display: 'flex', justifyContent: 'center', alignItems: 'center' } }>
        <Spin size={ "large" } tip={ '加载中...' }/>
      </div>
    );


  return (
    <div style={ { height: '100%' } }>
      { loading ? LoadComponent : null }
      { MainComponent }
    </div>
  );
}
