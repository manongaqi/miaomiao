<template>
    <div class="city_body">
				<!-- <div class="city_list">
					<div class="city_hot">
						<h2>热门城市</h2>
						<ul class="clearfix">
							<li>上海</li>
						</ul>
					</div>
					<div class="city_sort">
						<div>
							<h2>A</h2>
							<ul>
								<li>阿拉善盟</li>
								<li>鞍山</li>
								<li>安庆</li>
								<li>安阳</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="city_index">
					<ul>
						<li>A</li>
						<li>B</li>
						<li>C</li>
						<li>D</li>
						<li>E</li>
					</ul>
				</div> -->
				<div class="city_list">
					<div class="city_hot">
						<h2>热门城市</h2>
						<ul class="clearfix">
							<li v-for="item in hotList" :key="item.cityId" @click="handleToCity(item.name,item.cityId)">{{item.name}}</li>
						</ul>
					</div>
					<div class="city_sort" ref="city_sort">
						<div v-for="item in newlist" :key="item.index">
							<h2>{{item.index}}</h2>
							<ul>
								<li v-for="item in item.list" :key="item.cityId" @click="handleToCity(item.name,item.cityId)">{{item.name}}</li>
							</ul>
						</div>
					</div>
				</div>
				<div class="city_index">
					<ul>
						<li v-for="(item,index) in newlist" :key="item.index" @touchstart="handleToIndex(index)">{{item.index}}</li>
					</ul>
				</div>

			</div>
</template>

<script>
import axios from 'axios'
export default {
	name:'City',
	data(){
		return{
			datalist:[],
			newlist:[],
			hotList:[]
		}
	},
	mounted(){

		var newlist = window.localStorage.getItem('newlist');
		var hotList =  window.localStorage.getItem('hotList');
		if(newlist && hotList){
			this.newlist = JSON.parse(newlist);
			this.hotList = JSON.parse(hotList);
		}else{
			axios({
				url:"https://m.maizuo.com/gateway?k=4485050",
				headers:{
					'X-Client-Info': '{"a":"3000","ch":"1002","v":"5.0.4","e":"16263341444941200960258049","bc":"440100"}',
					'X-Host': 'mall.film-ticket.city.list'
				}
			}).then(res=>{
				console.log(res.data)
				var msg = res.data.msg;
				if(msg === 'ok'){
					var datalist = res.data.data.cities;
					var {newlist, hotList} = this.handleCity(datalist);
					this.newlist = newlist;
					this.hotList = hotList;
					window.localStorage.setItem('newlist',JSON.stringify(newlist));
					window.localStorage.setItem('hotList',JSON.stringify(hotList));
				}
			});
		}
	},
	methods:{
		handleCity(datalist){
			var letterArr = [];
			for(var i =65 ; i< 91; i++){
				letterArr.push(String.fromCharCode(i));
			}
			//console.log(letterArr)

			var newlist = [];
			for(var j = 0; j < letterArr.length; j++){
				var arr = datalist.filter(item=>item.pinyin.substring(0,1) === letterArr[j].toLowerCase())
				//console.log(arr)
				if(arr.length > 0){
                    newlist.push({
                        index:letterArr[j],
                        list:arr
                    })
                }
			}

			var hotList=[]
			for(var k = 0; k < datalist.length; k++){
				if(datalist[k].isHot === 1){
					hotList.push(datalist[k]);
				}
			}

			console.log(newlist)
			console.log(hotList)
			return{
				newlist,hotList
			}
		},
		handleToIndex(index){
			var h2 = this.$refs.city_sort.getElementsByTagName("h2");
			this.$refs.city_sort.parentNode.scrollTop = h2[index].offsetTop;
		},

		handleToCity(name,cityId){
			this.$store.commit('city/CITY_INFO',{name,cityId});
			window.localStorage.setItem('nowname',name);
			window.localStorage.setItem('nowcityId',cityId);
			this.$router.push('movie/nowPlaying');
		}
	}
}
</script>

<style scoped>
    #content .city_body{ margin-top: 45px; display: flex; width:100%; /* position: absolute; top: 0; bottom: 0; */}
	.city_body .city_list{ flex:1; overflow: auto; background: #FFF5F0;}
	.city_body .city_list::-webkit-scrollbar{
		background-color:transparent;
		width:0;
	}
	.city_body .city_hot{ margin-top: 20px;}
	.city_body .city_hot h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
	.city_body .city_hot ul li{ float: left; background: #fff; width: 29%; height: 33px; margin-top: 15px; margin-left: 3%; padding: 0 4px; border: 1px solid #e6e6e6; border-radius: 3px; line-height: 33px; text-align: center; box-sizing: border-box;}
	.city_body .city_sort div{ margin-top: 20px;}
	.city_body .city_sort h2{ padding-left: 15px; line-height: 30px; font-size: 14px; background:#F0F0F0; font-weight: normal;}
	.city_body .city_sort ul{ padding-left: 10px; margin-top: 10px;}
	.city_body .city_sort ul li{ line-height: 30px; line-height: 30px;}
	.city_body .city_index{ width:20px; display: flex; flex-direction:column; justify-content:center; text-align: center; border-left:1px #e6e6e6 solid; }
</style>
