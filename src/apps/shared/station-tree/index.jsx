import React, { ReactNode, useState, useEffect } from 'react'
import { Input, Tree } from 'antd'
import { DownOutlined, SearchOutlined, CarryOutOutlined, PlusSquareOutlined } from '@ant-design/icons';
import { _get, _post } from '../../server/http'
import stationIcon from '../../../assets/image/stationIcon.png';
import stationOffIcon from '../../../assets/image/stationOffIcon.png';
import treeIcon from '../../../assets/image/treeIcon.png';
import treeOpenIcon from '../../../assets/image/treeOpenIcon.png';
import IconFont from '../IconFont';


import './index.less'


const x = 1;
const y = 1;
const z = 1;
const gData = [];

const generateData = (_level, _preKey, _tns) => {
  const preKey = _preKey || '0';
  const tns = _tns || gData;

  const children = [];
  for (let i = 0; i < x; i++) {
    const key = `${preKey}-${i}`;
    tns.push({ title: key, key });
    if (i < y) {
      children.push(key);
    }
  }
  if (_level < 0) {
    return tns;
  }
  const level = _level - 1;
  children.forEach((key, index) => {
    tns[index].children = [];
    return generateData(level, key, tns[index].children);
  });
};
generateData(z);

const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const { key } = node;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
generateList(gData);

const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};

const StationTree = () => {
  const [showTree, setShowTree] = useState(true)  //显示隐藏
  const [currentTab, setCurrentTab] = useState(1) //地区河流等切换
  const [treeData, setTreeData] = useState([])   //树数据
  const [activedNode, setActivedNode] = useState(null)  //选中的节点
  const [state, setState] = useState({
    expandedKeys: [],
    searchValue: '',
    autoExpandParent: true,
  })

  useEffect(() => {
    _post('api/user/list/okr').then(res => {
      // setActivedNode(res.data.city[0])
      setTreeData(res.data.city)

    })
  }, [])

  useEffect(() => {
    const { searchValue, expandedKeys, autoExpandParent } = state;
    const loop = data =>
      data.map(item => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title =
          index > -1 ? (
            <span>
              {beforeStr}
              <span className="site-tree-search-value">{searchValue}</span>
              {afterStr}
            </span>
          ) : (
            <span>{item.title}</span>
          );
        if (item.children) {
          return { title, key: item.key, children: loop(item.children) };
        }

        return {
          title,
          key: item.key,
        };
      });
    // setTreeData(loop(gData))
  }, [state.searchValue])

  const changeTab = (index) => {
    setCurrentTab(index)
  }


  // 树节点选择
  const selectNode = (key, eve) => {
    if (eve.node.is_station) {
      setActivedNode(eve.node)

    }

  }
  // 搜索框
  const handleInpuChange = (e) => {
    const { value } = e.target;
    const expandedKeys = dataList
      .map(item => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, gData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);
    setState({
      expandedKeys,
      searchValue: value,
      autoExpandParent: true,
    });


  }
  // 展开关闭显示
  const toogleTree = () => {
    setShowTree(!showTree)
  }

  // 展开树
  const onExpand = (expandedKeys) => {
    setState({
      ...state,
      expandedKeys,
      autoExpandParent: false,
    });
    // console.log('Trigger Expand');
  };




  const tabInner = () => {
    if (currentTab == 1) {
      return (
        <div className="tree_warp">
          <Input suffix={<SearchOutlined />} placeholder='站点名称' onChange={handleInpuChange} />
          <div className="station_tree">
            {
              !!treeData.length ? <Tree
                showLine={
                  {
                    showLeafIcon: false
                  }
                }
                defaultExpandAll
                onSelect={(key, eve) => selectNode(key, eve)}
                treeData={treeData}
                onExpand={onExpand}
                showIcon="false"
                switcherIcon={null}
                icon={(props) => {
                  if (!props.is_station && (props.expanded === false)) {
                    return <IconFont iconName="fold_file" size="24" />
                    // return <img src={treeIcon} alt='' />
                  }
                  else if (!props.is_station && props.expanded === true) {
                    return <IconFont iconName="file_unfold" size="24" />
                    // return <img src={treeOpenIcon} alt=''></img>
                  }
                  else if (props.is_station && props.is_connected) {
                    return <img src={stationIcon} alt=''></img>
                  }
                  else if (props.is_station && !props.is_connected) {
                    return <img src={stationOffIcon} alt=''></img>
                  }

                }}
                titleRender={node => {
                  return (
                    <>
                      <span className={`titleTemplate ${node.is_station && activedNode?.id === node.id ? 'active' : null}`}>
                        <span>{node.title}&nbsp;
                          {
                            !node.is_station ?
                              <span style={{ color: '#999' }} >
                                ({node.count})
                              </span> : null
                          }

                        </span>
                      </span>
                    </>
                  )
                }}

              ></Tree>

                : null
            }

          </div>
        </div>
      )
    }
    if (currentTab == 2) {
      return (
        <div className="tree_warp">
          <Input prefix="￥" suffix="RMB" />
        </div>
      )
    }

    if (currentTab == 3) {
      return (
        <div className="tree_warp">
          <Input prefix="￥" suffix="RMB" />
        </div>
      )
    }
  }



  return (
    <div className={showTree ? 'AllTree_warp hasWidth' : 'AllTree_warp'} >
      <div style={{ display: showTree ? 'block' : 'none' }}>
        <div className="sort">
          <div className={currentTab == 1 ? 'active' : ''} onClick={() => changeTab(1)}>区域</div>
          <div className={currentTab == 2 ? 'active' : ''} onClick={() => changeTab(2)}>河流</div>
          <div className={currentTab == 3 ? 'active' : ''} onClick={() => changeTab(3)}>分组</div>
        </div>

        {
          tabInner()
        }

      </div>

      <i className={`foldIcon ${showTree ? 'canOpen' : null}`} onClick={toogleTree}></i>
    </div>
  )
}

export default StationTree
