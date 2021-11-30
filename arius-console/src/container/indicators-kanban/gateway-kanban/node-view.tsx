import { ReloadOutlined } from "@ant-design/icons";
import { TOP_MAP } from "constants/status-map";
import React, { memo, useState, useEffect, useCallback, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { Collapse } from "antd";
import _ from "lodash";
import {
  indexConfigClassifyList,
  defaultIndexConfigList,
  allCheckedData,
  getCheckedData,
} from "./node-view-config";
import { objFlat, getOption, formatterTimeYMDHMS } from "../config";
import { indexConfigData } from "./node-view-config";
import { RenderLine, IndexConfig, SelectRadio, Line } from "../components";
import {
  getCheckedList,
  setCheckedList,
  getNodeViewData,
  getNodeIpList,
} from "../../../api/gateway-kanban";
import "../style/index";
import { setIsUpdate } from "actions/gateway-kanban";
const { Panel } = Collapse;

export const classPrefix = "rf-monitor";

const NODE = "node";

export const NodeView = memo(() => {
  const { startTime, endTime, isMoreDay, isUpdate } = useSelector(
    (state) => ({
      startTime: (state as any).gatewayKanban.startTime,
      endTime: (state as any).gatewayKanban.endTime,
      isMoreDay: (state as any).gatewayKanban.isMoreDay,
      isUpdate: (state as any).gatewayKanban.isUpdate,
    }),
    shallowEqual
  );
  const dispatch = useDispatch();

  const reloadPage = () => {
    dispatch(setIsUpdate(!isUpdate));
  };

  const [topNu, setTopNu] = useState(TOP_MAP[0].value);
  const [nodeIp, setNodeIp] = useState("");
  const [nodeIpList, setNodeIpList] = useState([]);
  const [checkedData, setCheckedData] = useState(getCheckedData([]));
  const [metricsTypes, setMetricsTypes] = useState([]);
  const [viewData, setViewData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isFirst = useRef(true);
  const timeDiff = useRef(0);
  const prevTopNu = useRef(topNu);

  const getAsyncCheckedList = async () => {
    try {
      const checkedList = await getCheckedList(NODE);
      if (!checkedList || checkedList.length === 0) {
        setCheckedData(allCheckedData);
      } else {
        setCheckedData(getCheckedData(checkedList));
      }
    } catch (error) {
      setCheckedData(allCheckedData);
      console.log(error);
    }
  };

  const getAsyncNodeViewIpList = async () => {
    try {
      const ipList = await getNodeIpList();
      setNodeIpList(ipList);
    } catch (error) {
      console.log(error);
    }
  };

  const setIndexConfigCheckedData = (changeCheckedData) => {
    const checkedList = objFlat(changeCheckedData);
    setCheckedList(NODE, checkedList);
    setCheckedData(changeCheckedData);
    reloadPage();
  };

  const getAsyncViewData = useCallback(
    async (metricsTypes) => {
      return await getNodeViewData(
        metricsTypes,
        startTime,
        endTime,
        topNu,
        nodeIp
      );
    },
    [startTime, endTime, topNu, nodeIp]
  );

  const getAllAsyncViewData = async (metricsTypes) => {
    try {
      const res = await getAsyncViewData(metricsTypes);
      setViewData(
        res.map((item) => getOption(item, indexConfigData, isMoreDay))
      );
    } catch (error) {
      setViewData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAsyncCheckedList();
  }, []);

  useEffect(() => {
    getAsyncNodeViewIpList();
  }, []);

  useEffect(() => {
    setMetricsTypes(objFlat(checkedData));
  }, [checkedData]);

  useEffect(() => {
    if (
      isFirst.current ||
      timeDiff.current !== endTime - startTime ||
      prevTopNu.current !== topNu
    ) {
      setIsLoading(true);
      timeDiff.current = endTime - startTime;
      isFirst.current = false;
      prevTopNu.current = topNu;
    }
    if (!metricsTypes || metricsTypes.length === 0) {
      return;
    }
    getAllAsyncViewData(metricsTypes);
  }, [metricsTypes, getAsyncViewData]);

  const renderTopWhat = () => {
    return (
      <SelectRadio
        topNu={topNu}
        setTopNu={setTopNu}
        content={nodeIp}
        setContent={setNodeIp}
        contentList={nodeIpList}
        placeholder="请选择节点名称"
      />
    );
  };

  const renderConfig = () => {
    return (
      <IndexConfig
        title="节点指标配置"
        optionList={defaultIndexConfigList}
        checkedData={checkedData}
        setCheckedData={setIndexConfigCheckedData}
      />
    );
  };

  return (
    <>
      <div className={`${classPrefix}-overview-search`}>
        <div className={`${classPrefix}-overview-search-reload`}>
          <ReloadOutlined className="reload" onClick={reloadPage} />
          <span>上次刷新时间：{formatterTimeYMDHMS(endTime)}</span>
        </div>
        <div className={`${classPrefix}-overview-search-filter`}>
          {renderTopWhat()}
          {renderConfig()}
        </div>
      </div>
      <div className={`${classPrefix}-overview-content-line`}>
        {metricsTypes.map((item, index) => (
          <Line
            key={`${item}_${index}`}
            title={indexConfigData[item]?.title()}
            index={`${item}_${index}`}
            option={viewData[index] || {}}
            isLoading={isLoading}
          />
        ))}
      </div>
    </>
  );
});
