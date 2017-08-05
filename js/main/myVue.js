/**
 * Vue 路由 方法
 * @type {{props: [*], template: string}}
 */
const Music = {
    props: ["moviedata", "musictpl"],
    template: `
    <div class="ori-movie">
        <!-- 原声音乐 -->
        <div class="ori-music" v-for="(music,index) in moviedata.music">
            <!-- 胶片背景 -->
            <div class="film-bg"></div>
            <div class="movie-music">
                <div class="ori-title">- 电影原声 -</div>
                <div class="music-info">
                    <p class="music-title">{{ music.name }}</p>
                    <p class="music-singer">{{ music.singer }}</p>
                    <div class="music-rotate ">
                        <div class="music-circle"></div>
                        <a class="music-poster" @click="showMusic(homeHeader,musicDetails,music)">
                            <img :src="music.poster == true ? music.poster : '../../img/replace.png'" 
                                 :alt="music.name">
                            <div class="music-play"></div>
                        </a>
                        <div class="text-bg clearfix"></div>
                    </div>
                </div>
                <div class="music-bar clearfix">
                    <div class="fr clearfix">
                        <span class="icon-thumbs-bar fl"
                        @click="musicThubmsUp(music)"
                        :class="music.myIsPraise ? 'clickThumbs' : '' ">
                        </span>
                        <span class="fabu-num fl">{{ music.thumbs }}</span>
                        <span class="mask fl">-</span>
                        <span class="icon-collect-bar fl"
                        @click="musicCollect(music)"
                        :class="music.myIsCollect  ? 'clickCollect' : ''"></span>
                        <span class="mask fl">-</span>
                        <span class="icon-write-bar fl"
                              @click="showLayer">
                        </span>
                    </div>
                </div>
            </div>
            <!-- 写评论弹层 -->
            <div v-show="isRatingsShow" class="write-rat">
                <div class="write-content">
                    <textarea class="text-sty none-indent write-pl" placeholder="在这里写下你想说的话"
                            @input="textareaText" v-model="ratContent">
                    </textarea>
                    <p class="textarea-text"><span class="text-ctrl">{{remnant}}</span>/100</p>
                </div>
                <div class="write-relace fr">
                    <span class="write-relace-btn" @click="musicRatings(music)">发布</span>
                </div>
                <i class="write-close" @click="hideLayer"></i>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            ratContent: "",
            remnant: 0,
            isRatingsShow: false,
            homeHeader: false,
            musicDetails: true,
            isShow: false,
            musicUrl: 'http://192.168.0.244:8081/web/m2'
        }
    },
    methods: {
        // 音乐页点赞
        musicThubmsUp(_music){
            if (_music.myIsPraise == false) {
                this.$http.post(this.musicUrl + '/consumerPraise.do',
                    {
                        praiseType: 3, accountId: 1, targetId: _music.id,
                        accessToken: 'c89659c38becc80574d638706b018f40'
                    },
                    {emulateJSON: true}).then(response => {
                    if (response.data.code == 0) {
                        _music.myIsPraise = true;
                        _music.thumbs++
                    }
                    else {
                        alert(response.data.message);
                    }
                }, response => {   // error callback
                    alert("请求数据失败");
                });
            }
        },

        // 音乐收藏
        musicCollect(_music){
            if (_music.myIsCollect == false) {
                // console.log('-----------');
                this.$http.post(this.musicUrl + "/consumerCollect.do",
                    {
                        collectTargetId: _music.id, collectType: 1, accountId: 1,
                        paramType: 1,
                        accessToken: "c89659c38becc80574d638706b018f40"
                    },
                    {emulateJSON: true}).then(response => {
                    if (response.data.code == 0) {
                        _music.myIsCollect = true;
                    }
                    else {
                        alert(response.data.message);
                    }
                }, response => {  // error callback
                    alert("请求数据失败");
                });
            }
            else if (_music.myIsCollect) {
                this.$http.post(this.musicUrl + "/consumerCollect.do",
                    {
                        collectTargetId: _music.id, collectType: 1, accountId: 1,
                        paramType: 2,
                        accessToken: "c89659c38becc80574d638706b018f40"
                    },
                    {emulateJSON: true}).then(response => {
                    if (response.data.code == 0) {
                        _music.myIsCollect = false;
                    }
                    else {
                        alert(response.data.message);
                    }
                }, response => {  // error callback
                    alert("请求数据失败");
                });
            }
        },

        // 输入框字数限制
        textareaText() {
            this.remnant = this.ratContent.length;
            if (this.remnant > 100) {
                this.remnant = 100;
                this.ratContent = this.ratContent.substr(0, 100);
                alert("您最多只能输入100个字哦,亲");
            }
        },

        // 点击评论显示/隐藏层
        showLayer(){
            this.isRatingsShow = true;
        },
        hideLayer(){
            this.isRatingsShow = false;
        },

        // 发布评论
        musicRatings(_music){
            // console.log(this.ratContent);
            this.$http.post(this.musicUrl + "/insertComment.do",
                {
                    targetId: _music.id, commentType: 1, accountId: 1,
                    commentText: this.ratContent,
                    accessToken: "c89659c38becc80574d638706b018f40"
                },
                {emulateJSON: true}).then(response => {
                if (response.data.code == 0) {
                    this.hideLayer();
                    console.log(response.data.message);
                }
                else {
                    alert(response.data.message);
                }
            }, response => {
                alert("请求数据失败");
            });
        },

        // 修改父组件的值
        showMusic(homeHeader, musicDetails, _music){
            this.homeHeader = false;
            this.musicDetails = true;
            this.$emit('transmit-music', homeHeader, musicDetails, _music);
        }
    }
}

const Lines = {
    props: ['moviedata', 'linestpl'],
    template: `
     <div class="sta-lines">
        <div v-for="line in moviedata.lines">
            <!-- 胶片背景 -->
            <div class="film-bg"></div>
            <!-- 台词内容 -->
            <div class="stutra-line">
                <div class="ori-title">- 经典台词 -</div>
                <div class="line-info">
                    <a @click="showLines(homeHeader,linesDetails,line)" class="line-text">
                       {{ line.content }}
                    </a>
                </div>
               <div class="music-bar clearfix">
                    <div class="fr clearfix">
                        <span class="icon-thumbs-bar fl"
                              :class="line.myIsPraise ? 'clickThumbs' : ''"
                              @click="lineThumbs(line)">
                        </span>
                        <span class="fabu-num fl">{{ line.thumbs }}</span>
                        <span class="mask fl">-</span>
                        <span class="icon-copy-bar fl"
                              :data-clipboard-text="line.content"
                              data-clipboard-action="copy"
                              @click="copyContent">
                        </span>
                        <span class="mask fl">-</span>
                        <span class="icon-collect-bar fl"
                              @click="lineCollect(line)"
                              :class="line.myIsCollect  ? 'clickCollect' : ''">
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            homeHeader: false,
            linesDetails: true,
            lineUrl: "http://192.168.0.244:8081/web/m2"
        }
    },
    methods: {
        // 台词点赞
        lineThumbs(_line){
            if (_line.myIsPraise == false) {
                this.$http.post(this.lineUrl + "/consumerPraise.do",
                    {
                        praiseType: 2, targetId: _line.id, accountId: 1,
                        accessToken: "c89659c38becc80574d638706b018f40"
                    },
                    {emulateJSON: true}).then(response => {
                    if (response.data.code == 0) {
                        _line.myIsPraise == true
                        _line.thumbs++
                        console.log(response.data.message);
                    }
                }, response => {
                    alert("请求失败")
                });
            }
        },

        // 台词收藏
        lineCollect(_line){
            if (_line.myIsCollect == false) {
                this.$http.post(this.lineUrl + "/consumerCollect.do",
                    {
                        collectTargetId: _line.id, collectType: 2, accountId: 1,
                        paramType: 1,
                        accessToken: "c89659c38becc80574d638706b018f40"
                    },
                    {emulateJSON: true}).then(response => {
                    if (response.data.code == 0) {
                        _line.myIsCollect = true;
                        console.log(response.data.message);
                    }
                    else {
                        alert("请求数据失败");
                    }
                }, response => {  // error callback
                    alert("请求数据失败");
                });
            }
            else if (_line.myIsCollect) {
                this.$http.post(this.lineUrl + "/consumerCollect.do",
                    {
                        collectTargetId: _line.id, collectType: 2, accountId: 1,
                        paramType: 2,
                        accessToken: "c89659c38becc80574d638706b018f40"
                    },
                    {emulateJSON: true}).then(response => {
                    if (response.data.code == 0) {
                        _line.myIsCollect = false;
                        console.log(response.data.message);
                    }
                    else {
                        alert("请求数据失败");
                    }
                }, response => {  // error callback
                    alert("请求数据失败");
                });
            }
        },

        // 复制台词
        copyContent(){
            let clipboard = new Clipboard('.icon-copy-bar', {
                target: () => document.querySelector('.line-text')
            });
            clipboard.on('success', () => {
                alert("复制成功");
            });
        },

        // 传递数据
        showLines(homeHeader, linesDetails, _line){
            this.homeHeader = false;
            this.linesDetails = true;
            this.$emit('transmit-lines', homeHeader, linesDetails, _line);
        }
    }
}

const Storys = {
    props: ['moviedata', 'storytpl'],
    template: `
     <div class="movie-story">
        <!-- 胶片背景 -->
        <div class="film-bg"></div>
        <!-- 电影故事 -->
        <div class="story-info indent-sty" >
            <div class="ori-title">- 电影故事 -</div>
            <div class="text-sty story-text">
                <a @click="showStory(homeHeader,storyDetails)" 
                   class="storys-text">{{ moviedata.content }}</a>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            homeHeader: false,
            storyDetails: true
        }
    },
    methods: {
        // 传递数据
        showStory(homeHeader, storyDetails){
            this.homeHeader = false;
            this.storyDetails = true;
            this.$emit('transmit-story', homeHeader, storyDetails);
        }
    }
}

const Ratings = {
    props: ['moviedata', 'ratingstpl'],
    template: `
    <div class="user-ratings">
        <div v-for="rat in moviedata.ratings">
            <!-- 胶片背景 -->
            <div class="film-bg"></div>
            <!-- 用户评论 -->
            <div class="ratings-info indent-sty">
                <div class="ori-title">- 影片短评 -</div>
                <div class="user-u clearfix">
                    <div class="user-portrait fl">
                        <img :src="rat.avatar" :alt="rat.username">
                    </div>
                    <div class="user-info fl">
                        <span class="user-name">{{ rat.username ? rat.username : '悟空' }}</span>
                        <span class="rat-date">{{ rat.rateTime }}</span>
                    </div>
                </div>
                <div class="rat-text">
                    <a @click="showRatings(homeHeader,ratingsDetails,rat)" 
                       class="text-sty none-indent">{{ rat.content }}</a>
                </div>
                <div class="rat-bar clearfix">
                    <div class="fr">
                        <span class="icon-thumbs-bar fl"
                              :class="rat.myIsPraise ? 'clickThumbs' : ''"
                              @click="ratingsThumbs(rat)">
                        </span>
                        <span class="fabu-num fl">{{ rat.thumbs }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `,
    data(){
        return {
            homeHeader: false,
            ratingsDetails: true,
            url: "http://192.168.0.244:8081/web/m2"
        }
    },
    methods: {
        // 歌词点赞
        ratingsThumbs(_ratings){
            if (_ratings.myIsPraise == false) {
                this.$http.post(this.url + "/consumerPraise.do",
                    {
                        praiseType: 4, targetId: _ratings.id, accountId: 1,
                        accessToken: "c89659c38becc80574d638706b018f40"
                    },
                    {emulateJSON: true}).then(response => {
                    if (response.data.code == 0) {
                        _ratings.myIsPraise == true
                        _ratings.thumbs++
                        console.log(response.data.message);
                    }
                }, response => {
                    alert("请求失败")
                });
            }
        },

        showRatings(homeHeader, ratingsDetails, _rat){
            this.homeHeader = false;
            this.ratingsDetails = true;
            this.$emit('transmit-ratings', homeHeader, ratingsDetails, _rat);
        }
    }
}

const router = new VueRouter({
    routes: [
        {
            path: '/',
            redirect: "/music",
        },
        {
            path: '/music',
            component: Music
        },
        {
            path: '/lines',
            component: Lines
        },
        {
            path: '/storys',
            component: Storys
        },
        {
            path: '/ratings',
            component: Ratings
        },
    ]
});

/**
 * Vue 实例 方法
 */
new Vue({
    router,
    data() {
        return {
            ratContent: "", searchContent: "",
            isRatingsShow: false, homeHeader: true, flag: false,
            homeUrl: "http://192.168.0.244:8081/web/m2",
            movieData: {}, music: {}, line: {}, rat: {}, recommendData: {}, searchData: {},
            routerChange: 0, footerNavIndex: 0, detailsNav: 0, storyNav: 0, remnant: 0, myIndex: 0,
            tabChange: 0, ratSolt: 0,
            musicDetails: false, linesDetails: false, storyDetails: false, ratingsDetails: false,
        }
    },
    mounted() {
        // 1. 请求的数据
        this.loadMovieData();
        this.$router.push('/');
    },
    methods: {
        // 请求数据
        loadMovieData(){
            this.$http.post(this.homeUrl + '/index.do',
                {
                    accountId: 1, page: 2, pageSize: 1  // page是第几页  pageSize是每页多少条数据
                },
                {emulateJSON: true}).then(response => {
                const res = response;
                if (res && res.status == '200') {
                    if (res.data.data.length == 0) {
                        alert("No data，Please moment");
                    }
                    else {
                        this.movieData = res.data.data[0];
                    }
                    // console.log(this.movieData);
                }
            }, response => {  // error callback
                console.log("请求数据失败");
            });
        },

        // 歌词组件通信
        transmitMusic(homeHeader, musicDetails, _music){
            this.homeHeader = homeHeader;
            this.musicDetails = musicDetails;
            this.music = _music;
        },
        // 台词组件通信
        transmitLines(homeHeader, linesDetails, _line){
            this.homeHeader = homeHeader;
            this.linesDetails = linesDetails;
            this.line = _line;
        },
        // 故事组件通信
        transmitStory(homeHeader, storyDetails){
            this.homeHeader = homeHeader;
            this.storyDetails = storyDetails;
        },
        // 短评组件通信
        transmitRatings(homeHeader, ratingsDetails, _rat){
            this.homeHeader = homeHeader;
            this.ratingsDetails = ratingsDetails;
            this.rat = _rat;
        },

        // 返回首页
        backHome(){
            this.homeHeader = true;
            this.musicDetails = false;
            this.linesDetails = false;
            this.storyDetails = false;
            this.ratingsDetails = false;
        },

        // 音乐详情 -- 歌词点赞
        musicDetailsThumbs(_music){
            this.$refs.parentCallFn.musicThubmsUp(_music);
        },
        // 音乐详情 -- 歌词收藏/取消
        musicDetailsCollect(_music){
            this.$refs.parentCallFn.musicCollect(_music);
        },
        // 音乐详情 -- 输入框字数限制
        textareaText() {
            this.remnant = this.ratContent.length;
            if (this.remnant > 100) {
                this.remnant = 100;
                this.ratContent = this.ratContent.substr(0, 100);
                alert("您最多只能输入100个字哦,亲");
            }
        },
        // 音乐详情 -- 点击评论显示/隐藏层
        showLayer(){
            this.isRatingsShow = true;
        },
        hideLayer(){
            this.isRatingsShow = false;
        },
        // 音乐详情 -- 发布评论
        musicRatings(_music){
            this.$http.post(this.homeUrl + "/insertComment.do",
                {
                    targetId: _music.id, commentType: 1, accountId: 1,
                    commentText: this.ratContent,
                    accessToken: "c89659c38becc80574d638706b018f40"
                },
                {emulateJSON: true}).then(response => {
                if (response.data.code == 0) {
                    this.hideLayer();
                    console.log(response.data.message);
                }
                else {
                    alert(response.data.message);
                }
            }, response => {
                alert("请求数据失败");
            });
        },
        // 音乐详情 -- 歌词评论点赞
        musicDetailsThubmsUp(_rat){
            if (_rat.myIsPraise == false) {
                this.$http.post(this.homeUrl + '/consumerPraise.do',
                    {
                        praiseType: 1, accountId: 1, targetId: _rat.id,
                        accessToken: 'c89659c38becc80574d638706b018f40'
                    },
                    {emulateJSON: true}).then(response => {
                    if (response.data.code == 0) {
                        _rat.myIsPraise = true;
                        _rat.thumbs++
                        console.log(response.data.message);
                    }
                    else {
                        alert("点赞失败");
                    }
                }, response => {   // error callback
                    alert("请求数据失败");
                });
            }
        },

        // 台词详情 -- 点赞
        linesDetailsThumbs(_line){
            this.$refs.parentCallFn.lineThumbs(_line);
        },
        // 台词详情 -- 拷贝
        copyContent(_line){
            this.$refs.parentCallFn.copyContent(_line);
        },
        // 台词详情 -- 收藏
        linesDetailsCollect(_line){
            this.$refs.parentCallFn.lineCollect(_line);
        },

        // 短评详情 -- 点赞
        ratingsDetailsThumbs(_rat){
            this.$refs.parentCallFn.ratingsThumbs(_rat);
        },

        // 推荐
        recommend(){
            this.$http.post('http://192.168.0.244:8081/web/m2/recommend.do',
                {page: 1, pageSize: 1},  // page是第几页  pageSize是每页多少条数据
                {emulateJSON: true}).then(response => {
                const res = response;
                // console.log(res);
                if (res && res.status == '200') {
                    if (res.data.data.length == 0) {
                        console.log("No data，Please moment");
                    }
                    else {
                        this.recommendData = res.data.data;
                    }
                    // console.log(this.recommendData);
                }
            }, response => {  // error callback
                console.log("请求数据失败");
            });
        },

        // 搜索
        searchBtn(){
            this.$http.post('http://192.168.0.244:8081/m2/search.do',
                {searchText: this.searchContent, pageSize: 1, page: 1},
                {emulateJSON: true}).then(response => {
                const res = response;
                console.log(res);
                if (res && res.status == '200') {
                    if (res.data.data.length == 0) {
                        console.log("No data，Please moment");
                    }
                    else {
                        this.searchData = res.data.data;
                    }
                    console.log(this.searchData);
                }
            }, response => {  // error callback
                console.log("请求数据失败");
            });
        },

        //我的
        backMyList(){
            this.myIndex = 0;
        },

        //分享
        shareLink(){
            this.flag = !this.flag;
        }
    },
    components: {
        musicTpl: Music,
        linesTpl: Lines,
        storyTpl: Storys,
        ratingsTpl: Ratings
    },
}).$mount('#app');