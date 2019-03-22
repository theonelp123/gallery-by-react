require('normalize.css/normalize.css');
require('styles/App.scss');

import React from 'react';

// 获取图片相关数据
let imageDatas = require('../data/imageData.json');

// 利用自执行函数，将图片名信息转成图片URL的路径信息
imageDatas = (function genImageURL(imageDatasArr) {
  for (var i = 0,l = imageDatasArr.length; i < l; i++) {
    var singleImageData = imageDatasArr[i];

    singleImageData.imageURL = require('../images/' + singleImageData.fileName);

    imageDatasArr[i] = singleImageData;
  }

  return imageDatasArr;
})(imageDatas)

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL}
              alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}


class AppComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {



    // 首先拿到舞台的大小
    var stageDom = React.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    var imgFigureDom = React.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    // 计算中心图片的位置
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }

    // 计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfImgW - imgW;
    this.Constant.vPosRange.x[1] = halfImgW;
    console.log('aa')
    this.rearange(0);

  };

  render() {

    var controllerUnits = [],
        imgFigurs = [];

    imageDatas.forEach(function (value, index) {
      imgFigurs.push(<ImgFigure data={value} ref={'imgFigure' + index} />)
    })

    return(
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigurs}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    )
  }

}
AppComponent.Constant = {
  centerPos: {
    left: 0,
      right: 0
  },
  hPosRange: {    // 水平方向取值范围
    leftSecX: [0, 0],
    rightSecX: [0, 0],
    y: [0, 0]
  },
  vPosRange: {    // 垂直方向取值范围
    x: [0, 0],
    topY: [0, 0]
  }
}
/*
 * 重新布局所有图片
 * @param centerIndex 指定居中排布哪个图片
 */
AppComponent.rearrange = function (centerIndex) {

}

AppComponent.defaultProps = {
};

export default AppComponent;
