
## 插件安装
#### 数字输入框组件  待更多功能更新

##### 导入
> 将组件文件放在项目的compoments里，	import numSelect from '../../components/numSelect/numSelect.vue',即可！

----------------------------------		
#### *注意 修改width时 可以使用一个块级元素包裹起来 因为内部插件是100%宽度

> using:
#### 属性 attribute
| 属性名      | 值类型     | 说明                   | 可选值说明    | 默认值      |
|----------|---------|----------------------|----------|----------|
| value    | Number  | 用于赋值                 |          |          |
| name     | String  | 和原生一样的name属性 用于表单    |          |          |
| min      | Number  | 最小值 不做限制则传入null 默认为0 |          | 0        |
| max      | Number  | 最大值 不做限制则传入null      |          | 100      |
| disabled | boolean | 是否禁用                 |          | false    |
| color    | String  | 风格颜色 输入颜色代码即可        |          | \#ea5a59 |
| model    | String  | 风格类型 默认为1 一共5种       | 1 、2、3、4、5 | 1        |
| input    | Boolean | 允许输入                 |          | false    |
| size    | String | 尺寸大小 单位rpx                 |          | 40    |
| step    | Number | 步长每次加减的基础值，可以是小数                 |          | 1    |

----------------------------------	



#### 方法 method 
*  *getValue* > 获取某个组件的值,每次加减都会得到  *例：@getValue="getValue"* 

>>用法提示，如果有很多个组件，建议使用表单提交一次获取所有的值一起提交。


### 示范代码 

#### wxml
```<template>
	<view class="container">
		<view>
			<label>宽度30%-风格1-默认尺寸-值3-默认颜色</label>
			<view style="width: 30%;">
				<numSelect model="1" :value="3"></numSelect>
			</view>
		</view>
		
		<view>
			<label>宽度30%-风格1-默认尺寸-默认颜色-禁用</label>
			<view style="width: 30%;">
				<numSelect model="1" disable></numSelect>
			</view>
		</view>

		<view>
			<label>宽度40%-风格2-默认尺寸-颜色#6fb1f9</label>
			<view style="width: 40%;">
				<numSelect model="2" color="#6fb1f9" @getValue="getValue"></numSelect>
			</view>
			<label>选择的值：{{value}}</label>
		</view>
		
		
		<view>
			<label>宽度45%-风格3-尺寸45-颜色#16c2c2</label>
			<view style="width: 45%;">
				<numSelect model="3" size="45" color="#16c2c2"></numSelect>
			</view>
		</view>
		
		<view>
			<label>宽度60%-风格4-尺寸30-颜色#9266f9</label>
			<view style="width: 60%;">
				<numSelect model="4" size="30" color="#9266f9" :step="0.03"></numSelect>
			</view>
		</view>
		
		<view>
			<label>宽度60%-风格4-尺寸30-颜色#9266f9-禁用</label>
			<view style="width: 60%;">
				<numSelect model="4" size="30" disable color="#9266f9"></numSelect>
			</view>
		</view>
		
		<view>
			<label>宽度50%-风格5-尺寸45-颜色#aaaa00</label>
			<view style="width: 50%;">
				<numSelect model="5" size="45" color="#aaaa00"></numSelect>
			</view>
		</view>
	</view>
</template>

<script>
	import numSelect from '../../components/numSelect/numSelect.vue'
	export default {
		components: {
			numSelect
		},
		data() {
			return {
				value:null
			}
		},
		methods: {
			getValue(e){
				this.value =e;
			}
		}
	}
</script>

<style>
	.container>view {
		margin: 30rpx auto;
		text-align: center;
	}

	.container>view>view {
		margin: 10rpx auto;
	}

	.container>view>label {
		font-size: 24rpx;
		color: #5f5d5d;
	}
</style>

```


##### 发现问题请及时在评论区给我反馈，谢谢大家的指正，如果好用请给个好评哦~

	