import React, { useEffect, useRef, useState } from "react";
import { Button, message, Spin } from "antd";
import SimpleMDE from "simplemde";
import sendRequest from "../../utils/sendRequest";
import { IPostDetail, IUploadFile } from "../../dataStructures";
import style from './Editor.module.scss';
import TagGroup from "../TagGroup/TagGroup";
import { nanoid } from "nanoid";


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
  const mdEditorRef = useRef<any>();
  const fileOpenerRef = useRef<any>();
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [simpleMde, setSimpleMde] = useState<SimpleMDE>();
  const [selectedFile, setSelectedFile] = useState<File[]>();

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
      const t = data.tags.split(' ');
      if (t.length === 1 && t[0] === '') {
        setTags([]);
      } else {
        setTags(t);
      }
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

      for (const tool of mde.options.toolbar as SimpleMDE.ToolbarIcon[]) {
        if (tool.name === 'image') {
          tool.action = handleSelectImage;
        }
      }

      setSimpleMde(mde);
    }
  }, [loading]);

  // Image Selected
  useEffect(() => {
    handleFileUpload();
  }, [selectedFile]);

  async function handleFileUpload() {
    if (selectedFile) {
      const form = new FormData();
      form.append("pic", selectedFile[0], `${ nanoid(5) }.${ selectedFile[0].name.split('.').pop() }`);
      const res = await sendRequest<IUploadFile>({
        url: 'upload_image',
        method: 'POST',
        body: form,
      });
      if (res) {
        if (res.success) {
          simpleMde!.options.insertTexts!.image = ["![](", `${ res.url })`];
          SimpleMDE.drawImage(simpleMde!);
        } else {
          message.error('上传失败');
        }
      }
    }
  }

  function handleSelectImage() {
    fileOpenerRef.current!.click();
  }


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
        <input style={ { display: 'none' } }
               ref={ fileOpenerRef }
               type="file"
               onChange={ (e) => setSelectedFile(e.target.files as any) }
        />
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
          <TagGroup tags={ tags } setTags={ setTags }/>
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
