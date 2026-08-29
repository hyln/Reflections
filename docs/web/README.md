


# SSL 更新

去这里申请
https://console.cloud.tencent.com/certoverview

下载 ，覆盖，按文档覆盖

重启apache

```bash
systemctl restart apache2
```

# Let’s Encrypt

免费好用

## 开始前

网站需要能被公网访问到，cerbot，需要确认域名所有权，在网站域名创建

```python
mkdir -p .well-known/acme-challenge
echo "test" > .well-known/acme-challenge/test.txt
```

## 安装cerbot

```python
snap install --classic certbot
```

## 获取证书

```python
sudo certbot --nginx -d example.com
```

```python
sudo certbot renew --dry-run  # dry run 测试模式，不会真的签发证书

```