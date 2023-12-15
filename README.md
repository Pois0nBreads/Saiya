# Saiya

Saiya 服务管理器
转至元数据结尾
由 徐铭泽创建, 最后修改于昨天9:30 上午转至元数据起始
Saiya 主要用于配置开机自启 代管服务 可在Web端查看 控制服务状态 以及观察程序输出状态

节约 程序员 编写 Systemd Service Unit 的时间

Saiya 配置

Saiya 默认配置文件位于 /usr/local/saiya/config.json

systemd 服务名称 Saiyad.service

{

       "auto": true,                                             //是否开机自启

       "port": 16666,                                           //Web管理端口

       "hostname": "0.0.0.0",                               //Web监听地址（默认不需要变动）

       "services": [                                              //需要启动的服务列表 数组，一个对象 代表一个服务

              {

                     "des": "测试服务一",                   //服务名称                          不可为空

                     "cmd": "ping",                            //可执行程序               不可为空

                     "args": ["127.0.0.1", "-t"],      //启动参数                          不可空 不需要参数填入[]

                     "format": "utf8",                          //log信息日志输出格式     可为空 默认为utf8

                     "log_max_size": 200,                   //log缓冲区大小                 可为空 默认为200行

              },

              {

                     "des": "测试服务二",

                     "cmd": "java",

                     "args": ["-jar","-Xms6m","-Xmx64m","-XX:PermSize=64M","-XX:MaxPermSize=64m","/opt/service/haikong-gateway.jar"], //注意 启动参数需要填写绝对路径

                     "format": "utf8"

              }

       ]

}
