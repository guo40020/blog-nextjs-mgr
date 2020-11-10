import React, { createRef, useEffect, useState } from "react";
import { Input, message, Tag } from "antd";
import style from './TagGroup.module.scss';
import { PlusOutlined } from "@ant-design/icons";

interface ITagGroupProps {
  initTags: string[]
}

export default function TagGroup({ initTags }: ITagGroupProps) {
  const [tags, setTags] = useState<string[]>([]);
  const [editing, setEditing] = useState(false);
  const [currentEditing, setCurrentEditing] = useState('');
  const inputRef = createRef<any>();

  useEffect(() => {
    setTags([...initTags]);
  }, []);

  function handleTagClose(index: number) {
    const t = [...tags];
    t.splice(index, 1);
    setTags(t);
  }

  function handleAddClicked() {
    setEditing(true);
    inputRef.current.focus();
  }

  function handleAddCanceled() {
    setEditing(false);
  }

  function handleEditOnChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentEditing((e.target.value.replace(' ', '')));
  }

  function handleAddComplete(e: React.KeyboardEvent<HTMLInputElement>) {
    if (tags.indexOf(currentEditing) === -1) {
      setTags([...tags, currentEditing]);
    } else {
      message.warn('标签已存在');
    }
    setCurrentEditing('');
    setEditing(false);
  }


  return (
    <div>
      {
        tags.map((v, i) => {
          return <Tag closable onClose={ () => handleTagClose(i) } key={ i }># { v }</Tag>;
        })
      }
      <Tag style={ { display: editing ? 'none' : '' } }
           onClick={ handleAddClicked }
           className={ style.addTag }><PlusOutlined/>添加
      </Tag>
      <Input style={ { display: editing ? '' : 'none' } }
             value={ currentEditing }
             onChange={ handleEditOnChange }
             className={ style.input }
             ref={ inputRef }
             onBlur={ handleAddCanceled }
             onPressEnter={ handleAddComplete }
      />
    </div>
  );
}
