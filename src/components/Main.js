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
  constructor() {
    super(...arguments);
    
    this.handleClick = this.handleClick.bind(this);
    
  }
  /*
  * imgFigure的点击处理函数
  * */
  handleClick(e) {
    this.props.inverse();
    
    e.stopPropagation();
    e.preventDefault();
  }
  
  render() {
    
    let styleObj = {};
    
    // 如果props中指定了这张图的位置，则使用
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }
    
    //如果图片的旋转角度有值并且不为0， 添加旋转角度
    if(this.props.arrange.rotate) {
      (['-moz-', '-ms-', '-webkit-', '']).forEach(function (value) {
        styleObj[value + 'transform'] = 'rotate(' + this.props.arrange.rotate + 'deg)'
      }.bind(this))
    }
    
    var imgFigureClassName = 'img-figure';
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';
    
    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick}>
        <img src={this.props.data.imageURL}
              alt={this.props.data.title}/>
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back" onClick={this.handleClick}>
            <p>
              {this.props.data.desc}
            </p>
          </div>
        </figcaption>
      </figure>
    )
  }
}


class AppComponent extends React.Component {
  state = {
    // 存储图片坐标
    imgsArrangeArr: [
      /* {
       pos: {
         left: '0',
         top: '0'
       },
       rotate: 0, //旋转角度
       isInverse:false  // 图片正反面
	   }*/
    ]
  };
  // 定义坐标范围
  Constant = {
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
  };
  
  constructor() {
    super(...arguments);
    
    this.reArrange = this.reArrange.bind(this);
    
  }
  /*
 * 重新布局所有图片
 * @param centerIndex 指定居中排布哪个图片
 */
  reArrange(centerIndex) {
    let imgsArrangeArr = this.state.imgsArrangeArr,
      Constant = this.Constant,
      centerPos = Constant.centerPos,
      hPosRange = Constant.hPosRange,
      vPosRange = Constant.vPosRange,
      hPosRangeLeftSecX = hPosRange.leftSecX,
      hPosRangeRightSecX = hPosRange.rightSecX,
      hPosRangeY = hPosRange.y,
      vPosRangeTopY = vPosRange.topY,
      vPosRangeX = vPosRange.x,
      
      imgsArrangeTopArr = [],
      topImgNum = Math.ceil(Math.random() * 2), // 取一个或者不取
      topImgSpliceIndex = 0,
      
      imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
    
    
    // 首先居中 centerIndex 的图片
    imgsArrangeCenterArr[0].pos = centerPos;
    
    // 居中的图片不需要旋转
    imgsArrangeCenterArr[0].rotate = 0;
  
    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum) );
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);
    
    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach(function (value, index) {
      imgsArrangeTopArr[index] = {
        pos: {
          top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
          left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
        },
        rotate: get30DegRandom()
        
      }
    })
    
    // 布局两侧的图片信息
    for(let i = 0, j = imgsArrangeArr.length, k = j/2; i < j; i++) {
      let hPosRangeLORX = null;
      
      // 前半部分布局左边， 后半部分布局右边
      if(i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }
      
      imgsArrangeArr[i] = {
        pos: {
          top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
          left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
        },
        rotate: get30DegRandom()
      }
    }
    
    if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0])
    }
    
    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    
    this.setState({
      imgsArrangeArr: imgsArrangeArr
    })
  }
  
  /*
  * 翻转图片
  * @param index 输入当前被执行inverse操作的图片对应的图片信息数组的index值
  * @return {Function} 这是一个必报函数，其内return一个真正待被执行的函数
  * */
  inverse(index) {
    return function () {
      let imgsArrangeArr = this.state.imgsArrangeArr;
      
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      
      this.setState({
        imgsArrangeArr: imgsArrangeArr
      })
    }.bind(this)
  }
  
  /*
  * 利用 reArrange函数，居中对应index的推按
  * @param index, 需要居中的图片信息数组index
  * @return {Function}
  * */
  center(index) {
    return function () {
      this.reArrange(index);
    }.bind(this);
  }

  // 组件加载以后，为每张图片计算其位置的范围
  componentDidMount() {
  
    // 首先拿到舞台的大小
    let stageDom = this.refs.stage,
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    let imgFigureDom = this.refs.imgFigure0,
        imgW = 360,//imgFigureDom.scrollWidth,
        imgH = 380,//imgFigureDom.scrollHeight,
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
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    
    this.reArrange(0);

  }

  render() {
    const { arrange } = this.props;
    let controllerUnits = [],
        imgFigurs = [];

    imageDatas.forEach(function (value, index) {
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos: {
            left: '0',
            top: '0'
          },
          rotate: 0,
          isInverse: false
        }
      }
      imgFigurs.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />)
    }.bind(this))

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

/*
 * 获取区间内的一个随机数
 */
function getRangeRandom(low, high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

/**
 * 获取 0~ 30°之间的任意正负值
 */
function get30DegRandom() {
  return (Math.random() > 0.5 ? '' : '-') +  Math.ceil(Math.random() * 30)
}




AppComponent.defaultProps = {
};

export default AppComponent;
