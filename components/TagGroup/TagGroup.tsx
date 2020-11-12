import React, { useRef, useState } from "react";
import { Input, message, Tag } from "antd";
import style from './TagGroup.module.scss';
import { PlusOutlined } from "@ant-design/icons";

interface ITagGroupProps {
  tags: string[],
  setTags: React.Dispatch<string[]>
}

export default function TagGroup({ tags, setTags }: ITagGroupProps) {
  const [editing, setEditing] = useState(false);
  const [currentEditing, setCurrentEditing] = useState('');
  const inputRef = useRef<any>();

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

  function handleAddComplete() {
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
             onPressEnter={ handleAddComplete }
             onKeyPress={ (e) => e.key == 'Escape' ? handleAddCanceled() : null }
      />
    </div>
  );
}
