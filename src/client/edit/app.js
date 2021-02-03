import React, { useEffect, useRef, useState } from "react";
import qs from "query-string";
import { Input, Button } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  PlusOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import Text from "./text";
import { copyCongig } from "./utils";
import Pdf from "./pdf";
import "antd/dist/antd.css";
import "./app.less";

const parsed = qs.parse(window.location.search);
const file = parsed.file;
const url = `./${file}.pdf`;

const pdf = new Pdf();

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [pdfConfig, setPdfConfig] = useState({});
  const [currentActiveItem, setCurrentActiveItem] = useState(null);

  const containerRef = useRef();

  useEffect(() => {
    pdf.init(url, containerRef.current, (totalPage) => setTotalPage(totalPage));
  }, []);

  const handlePrePage = () => {
    pdf.showPrevPage((page) => {
      setCurrentPage(page);
    });
  };

  const handleNextPage = () => {
    pdf.showNextPage((page) => {
      setCurrentPage(page);
    });
  };

  const handleAddText = () => {
    const id = new Date().getTime();
    const config = {
      id,
      page: currentPage,
      top: 200,
      left: 200,
      field: "fieldName",
      fontSize: 16,
      fontColor: "#000",
    };
    updateConfig(config);
  };

  const handleCopyConfig = () => {
    copyCongig(JSON.parse(JSON.stringify(pdfConfig)));
  };

  const handleUpdateConfig = (prop) => (e) => {
    const id = currentActiveItem.id;
    const updated = {
      ...currentActiveItem,
      [prop]: e.target.value,
    };
    updateConfig(updated);
  };

  const updateConfig = (config) => {
    const id = config.id;
    setPdfConfig({
      ...pdfConfig,
      [id]: config,
    });
    setCurrentActiveItem({...config});
  };

  const generateForm = () => {
    const needRenderConfig = [];
    for (let id in pdfConfig) {
      if (pdfConfig[id] && pdfConfig[id].page === currentPage) {
        needRenderConfig.push(pdfConfig[id]);
      }
    }
    return needRenderConfig.map((config) => (
      <Text
        key={config.id}
        config={config}
        setActiveItem={setCurrentActiveItem}
        updateConfig={updateConfig}
      />
    ));
  };

  const handleDelete = () => {
    const id = currentActiveItem.id;
    delete pdfConfig[id];
    setPdfConfig({ ...pdfConfig });
  };

  return (
    <div>
      <div className="top-bar">
        <button className="btn" onClick={handlePrePage}>
          <LeftOutlined />
          上一页
        </button>
        <button className="btn" onClick={handleNextPage}>
          下一页 <RightOutlined />
        </button>
        <span className="page-info">
          Page <span>{currentPage}</span> of <span>{totalPage}</span>
        </span>
        <button className="btn" onClick={handleAddText}>
          添加 Text <PlusOutlined />
        </button>
        <button className="btn" onClick={handleCopyConfig}>
          复制 config <CopyOutlined />
        </button>
      </div>
      <div className="content">
        <div className="left-side">
          <div ref={containerRef} className="pdf-container">
            {generateForm()}
          </div>
        </div>
        <div className="right-side">
          {currentActiveItem && (
            <>
              <div className="edit-row">
                <span className="label">字段名</span>:{" "}
                <span className="value">
                  {" "}
                  <Input
                    value={currentActiveItem.field}
                    onChange={handleUpdateConfig("field")}
                  />
                </span>
              </div>
              <div className="edit-row">
                <span className="label">字体大小</span>:{" "}
                <span className="value">
                  <Input
                    value={currentActiveItem.fontSize}
                    onChange={handleUpdateConfig("fontSize")}
                  />
                </span>
              </div>
              <div className="edit-row">
                <span className="label">字体颜色</span>:{" "}
                <span className="value">
                  <Input
                    value={currentActiveItem.fontColor}
                    onChange={handleUpdateConfig("fontColor")}
                  />
                </span>
              </div>
              <div className="edit-row">
                <Button onClick={handleDelete}>删除</Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
