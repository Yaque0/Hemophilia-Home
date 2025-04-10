# 血友病慈善之家后端开发日志

## 2024-03-XX 开发内容

### 1. 论坛功能开发
#### 1.1 帖子功能
- 创建帖子模型 (Post)
- 实现帖子 CRUD 接口
- 帖子列表支持分页和分类筛选
- 帖子详情自动增加浏览量

#### 1.2 评论功能
- 创建评论模型 (Comment)
- 实现评论的增删查功能
- 评论与帖子、用户关联

### 2. 商城功能开发
#### 2.1 商品功能
- 创建商品模型 (Product)
- 实现商品 CRUD 接口（管理员权限）
- 商品列表支持分页和分类筛选

#### 2.2 购物车功能
- 创建购物车模型 (Cart)
- 实现购物车的增删改查功能
- 购物车商品数量验证和库存检查

## API 测试文档

### 1. 论坛接口测试

#### 1.1 创建帖子
http
POST http://localhost:3000/api/posts
Headers:
Authorization: Bearer {your_token}
Content-Type: application/json
{
"title": "血友病患者的日常护理",
"content": "血友病患者在日常生活中需要注意以下几点：\n1. 预防性用药\n2. 避免剧烈运动\n3. 保持良好的生活习惯",
"category": "护理知识"
}

#### 1.2 获取帖子列表
http
GET http://localhost:3000/api/posts?page=1&limit=10&category=护理知识

#### 1.3 获取帖子详情
http
GET http://localhost:3000/api/posts/1

#### 1.4 发表评论
```http
POST http://localhost:3000/api/comments
Headers:
    Authorization: Bearer {your_token}
Content-Type: application/json

{
    "postId": 1,
    "content": "感谢分享这些实用的护理知识！"
}
```

#### 1.5 获取帖子评论
http
GET http://localhost:3000/api/comments/post/1?page=1&limit=10

#### 1.6 删除评论
http
DELETE http://localhost:3000/api/comments/1
Headers:
    Authorization: Bearer {your_token}

### 2. 商城接口测试

#### 2.1 创建商品（管理员）
```http
POST http://localhost:3000/api/products
Headers:
    Authorization: Bearer {admin_token}
Content-Type: application/json

{
    "name": "凝血因子VIII",
    "description": "用于预防和治疗血友病A型患者的出血，建议在医生指导下使用",
    "price": 1000.00,
    "stock": 100,
    "category": "药品",
    "image": "factor8.jpg"
}
```

#### 2.2 获取商品列表
```http
GET http://localhost:3000/api/products?page=1&limit=10&category=药品
```

#### 2.3 获取商品详情
```http
GET http://localhost:3000/api/products/1
```

#### 2.4 添加商品到购物车
```http
POST http://localhost:3000/api/cart
Headers:
    Authorization: Bearer {your_token}
Content-Type: application/json

{
    "productId": 1,
    "quantity": 2
}
```

#### 2.5 获取购物车列表
```http
GET http://localhost:3000/api/cart
Headers:
    Authorization: Bearer {your_token}
```

#### 2.6 更新购物车商品数量
```http
PUT http://localhost:3000/api/cart/1/quantity
Headers:
    Authorization: Bearer {your_token}
Content-Type: application/json

{
    "quantity": 3
}
```

#### 2.7 删除购物车商品
```http
DELETE http://localhost:3000/api/cart/1
Headers:
    Authorization: Bearer {your_token}
```

## 数据库表结构

### 1. posts 表
- id: 主键
- userId: 用户ID（外键）
- title: 标题
- content: 内容
- category: 分类
- views: 浏览量
- likes: 点赞数
- status: 状态

### 2. comments 表
- id: 主键
- postId: 帖子ID（外键）
- userId: 用户ID（外键）
- content: 评论内容
- status: 状态

### 3. products 表
- id: 主键
- name: 商品名称
- description: 商品描述
- price: 价格
- stock: 库存
- image: 图片
- category: 分类
- status: 状态

### 4. carts 表
- id: 主键
- userId: 用户ID（外键）
- productId: 商品ID（外键）
- quantity: 数量

## 下一步开发计划
1. 实现订单管理功能
2. 集成支付系统
3. 添加商品评价功能
4. 实现商品收藏功能