import React from "react";
import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from "@ant-design/icons";

interface IArticleCardProps {
  title: string;
  description: string;
}

export default function ArticleCard({ title, description }: IArticleCardProps) {
  return (
    <Card
      actions={[
        <SettingOutlined/>,
        <EditOutlined/>,
        <EllipsisOutlined/>
      ]}
    >
      <Meta
        title={title}
        description={description}
      />
    </Card>
  )
}