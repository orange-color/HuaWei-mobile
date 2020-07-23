$(function () {
    let $headerTop = $('.header-top');
    let $headerMiddle = $('.header-middle');
    let $section1 = $('.section1');
    let $section2 = $('.section2');

    // 导航条元素激活样式设置
    $('.navbar-toggler').click(function () {
        $(this).toggleClass('on')
    });
    $('.login').hover(function () {
        $('.login-box').addClass('on');
    },function () {
        $('.login-box').removeClass('on');
    });
    $('.nav-item').click(function () {
        $(this).addClass('active').siblings().removeClass('active');
    });
    $('.modal-header').find('span').click(function () {
        $(this).addClass('active').siblings('span').removeClass('active')
    });
    $('.modal-close').click(function () {
        $('.modal').modal('hide')
    });

    // 导航栏显示与隐藏设置
    let $headerHeight = $headerTop.height() + $headerMiddle.height();
    $(window).scroll(function () {
        let offsetY = $('body').scrollTop() + $('html').scrollTop(); //兼容IE
        if (offsetY >= $headerHeight){
            $headerTop.removeClass('d-lg-block');
            $headerMiddle.hide();
        }else {
            $headerTop.addClass('d-lg-block');
            $headerMiddle.show();
        }
    });
    $('.header-bottom>ul>li').click(function () {
        if ($(this).index() === 3) return;
        $(this).addClass('active').siblings('li').removeClass('active')
    });

    /* 轮播图 动画效果 */
    var mySwiper = new Swiper ('.swiper-container', {
        direction: 'vertical', // 垂直切换选项
        effect: 'fade', //设置切换效果
        // loop: true, // 循环模式选项
        autoplay: false,
        speed: 500,
        initialSlide :1,

        // 如果需要分页器
        pagination: {
            el: '.swiper-pagination',
            bulletClass: "my-bullet", //需要设置，my-bullet样式
            bulletActiveClass:"my-bullet-active", //设置激活类名
            clickable :true //设置分页器是否可点击
        },

        // 初始化动画元素
        on:{
            init: function(){
                swiperAnimateCache(this); //隐藏动画元素
                swiperAnimate(this); //初始化完成开始动画
            },
            slideChangeTransitionEnd: function(){
                swiperAnimate(this); //每个slide切换结束时也运行当前slide动画
                //this.slides.eq(this.activeIndex).find('.ani').removeClass('ani'); 动画只展现一次，去除ani类名
                let offsetY = this.activeIndex * 45;
                $('.swiper-name>span').animate({
                    top: - offsetY + "px"
                },1000);
                $('.swiper-num span').animate({
                    top: - offsetY + "px"
                },1000)
            }
        }
    });

    /* 视差动画 */
    /* 设置 section1 元素*/
    let controller = new ScrollMagic.Controller();
    new ScrollMagic.Scene({
        triggerElement: '.section1-trigger',
        triggerHook: 'onLeave',  // 当触发元素离开视口时触发
        duration: $section1.height()  //有效范围为 section1 高度
    }).setTween(TweenMax.to('.section1',1,{
        opacity: 0.6
    })).setPin('.section1',{pushFollowers:false}).addTo(controller);


    // 创建 section2 文字动画效果
    let flag;
    let $section2Word = $('.section2 p').eq(0);
    let scene1 = new ScrollMagic.Scene({
        triggerElement: '.section2-trigger',
        triggerHook: 'onEnter'
    }).on('start', function(event){
        if (event.scrollDirection === "FORWARD"){
            // 防抖 待优化
            flag = $section2Word.css('opacity') < 1 && $section2Word.css('opacity') > 0;
            if (!flag) {
                scene1.setVelocity(['.section2-top>div','.section2-top p'],{
                    translateY: [0,'50%'],    // 前面的是结束状态值，后面的是初始状态值
                    opacity: [1,0]
                },{
                    delay: 0.3,
                    duration: 500,
                    ease: 'easeOut',
                })
            }else {
                scene1.removeVelocity();
            }
        }
    }).addTo(controller);




    // 设置 section2 图片动画效果
    let $section2Img1 = $section2.find('img').eq(0);
    let $section2Img2 = $section2.find('img').eq(1);
    let $section2Img3 = $section2.find('img').eq(2);
    let $section2Img4 = $section2.find('img').eq(3);
    // 创建 section2 时间轴动画 TimeLineMax
    let tl = new TimelineMax();
    tl.add([
        TweenMax.to($section2Img1,2,{
            transform: 'translateX(-130%)',
            opacity: 0,
            ease: SteppedEase.config(12)
        }),TweenMax.to($section2Img2,2,{
            transform: 'translateX(130%)',
            opacity: 0,
            ease: SteppedEase.config(12)
        }),
        TweenMax.to($section2Img3,2, {
            delay: 1,
            opacity: 1,
        })
    ]);
    tl.add(TweenMax.to($section2Img4,1,{
        opacity: 1,
    }));
    // 将 section2 动画添加到场景中
    new ScrollMagic.Scene({
        offset: $('.section2-top').height() + 50,
        triggerElement: '.section2-trigger',
        triggerHook: 'onLeave',
        duration: '100%'
    }).setTween(tl).setPin('.section2').addTo(controller);


    new ScrollMagic.Scene({
        triggerElement: '.section2-bottom',
        triggerHook: 'onCenter',
    }).on('start',function (event) {
        if (event.scrollDirection === "FORWARD"){
            // 跳转到指定的轮播页面
            mySwiper.slideTo(0,0);
            // 开始自动播放
            mySwiper.autoplay.start();
        }else{
            // 暂停自动播放
            mySwiper.autoplay.stop();
        }
    }).addTo(controller)
});