import React, { useState } from 'react'
import { connect } from 'react-redux';
import './index.less'

const Loading = ({dispatch,id,load }) => {
  const [widthPro, setWidthPro] = useState(100)
  let loadStyle = { width: widthPro + "%" }

  return (
    <div>
      {
        load.showLoading ?
          <div id={id} className="loading" style={loadStyle} ></div>
          : null
      }
      {
          load.showLoading &&  load.loadType == 'full'?
          <section className="full-load">
          <div className="text">{ load.loadText }</div>
          <div className="load">
            <div>L</div><div>O</div><div>A</div><div>D</div><div>I</div><div>N</div><div>G</div>
          </div>
        </section>
        : null
      }

     
    </div>
  )
}

const mapStateToProps = state => state


export default connect(mapStateToProps)(Loading);
