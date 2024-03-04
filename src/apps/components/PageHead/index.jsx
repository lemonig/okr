import React from "react";
import { LeftSquareOutlined } from "@ant-design/icons";
import IconFont from "@Components/IconFont";

function PageHead({ title, onClick }) {
  return (
    <>
      <div className="module-title">
        <IconFont
          name="fanhui"
          onClick={onClick}
          style={{ marginRight: "4px", cursor: "pointer" }}
          size={20}
        />

        {title}
      </div>
      <style jsx="true">
        {`
          .module-title {
            font-size: 20px;
            font-weight: bold;
            margin: 0 0 20px 0;
            height: 30px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        `}
      </style>
    </>
  );
}

export default PageHead;
