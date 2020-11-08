import React from "react";
import { Card, Popconfirm } from "antd";
import Meta from "antd/lib/card/Meta";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";

interface IArticleCardProps {
  title: string;
  description: string;
}

export default function ArticleCard({ title, description }: IArticleCardProps) {
  return (
    <Card
      style={ { width: '20rem', margin: '1rem' } }
      actions={ [
        <EditOutlined/>,
        <Popconfirm title={ '确认删除？' } okText={ '删除' } cancelText={ '取消' }
                    icon={ <DeleteOutlined style={ { color: 'red' } }/> }>
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