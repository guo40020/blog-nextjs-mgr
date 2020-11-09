import React from "react";
import { Card, Popconfirm } from "antd";
import Meta from "antd/lib/card/Meta";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface IArticleCardProps {
  postId: string;
  title: string;
  description: string;
  onDelete: (id: string) => Promise<void>;
}

export default function ArticleCard({ postId, title, description, onDelete }: IArticleCardProps) {
  async function handleConfirmDelete() {
    await onDelete(postId);
  }

  return (
    <Card
      style={ { width: '20rem', margin: '1rem', flex: 'none' } }
      actions={ [
        <EditOutlined/>,
        <Popconfirm title={ '确认删除？' }
                    okText={ '删除' }
                    cancelText={ '取消' }
                    icon={ <DeleteOutlined style={ { color: 'red' } }/> }
                    onConfirm={ handleConfirmDelete }
        >
          <DeleteOutlined style={ { color: 'red' } }/>
        </Popconfirm>
      ] }
    >
      <Meta
        title={ title }
        description={ description }
      />
    </Card>
  )
}