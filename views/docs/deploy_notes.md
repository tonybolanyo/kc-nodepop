# Deploying nodepop on AWS free tier server

Here you can read some notes I take while deploying nodepop on a free tier AWS server.

# Crear máquina virtual

- Entrar en aws.amazon.com y, en el apartado de EC2, crear una nueva instancia con el AMI: **Ubuntu Server 16.04 LTS (HVM), SSD Volume Type** - ami-da05a4a0
- Usar la instancia **t2.micro** que es válida para el **Free tier**
- Las opciones de configuración por defecto son válidas, pero asegúrate de que se asigna una dirección IP y **marca la opción Protect against accidental termination** para evitar eliminar la máquina por error.
- Agregar un disco. Como vamos a utilizar muy pocas cosas en la práctica, con los 8Gb que asigna por defecto debería ser suficiente.
- En el último paso puedes agregar una etiqueta a la instacia, por si quieres tenerlas clasificadas de alguna manera.
- Por último, en los grupos de seguridad, puedes reutilizar el grupo que utilizamos en clase, pero por cuestión de práctica vamos a crear uno nuevo: kc-tony
- Al crear el grupo de seguridad ya nos indica la apertura del puerto 22 para SSH. Como ya sabemos que vamos a utilizar la web (puerto 80) y que queremos usar un puerto alternativo para el SSH, podemos abrirlos directamente aquí.
    - Puerto 80 para la web
    - Puerto XXXX para el SSH (ojo, no quites el 22, hay que configurar primero el servicio en el sistema operativo para que use este puerto en lugar del 22).

En la pantalla de revisión nos alerta de que el servidor está accesible desde cualquier parte del mundo. Esto podemos solucionarlo solamente si tenemos una IP estática desde la que vamos a conectarnos. En caso contrario este es precisamente el comportamiento que deseamos.

**¡Ya puedes lanzar la máquina!**

Puedes generar un par de claves propias para acceder a la máquina o reutilizar un par existente. Crearemos un nuevo par solamente para este propósito.

Si todo ha ido bien, recibirás un mensaje de que la máquina está lanzándose y, en poco tiempo, (menos de un minuto) tu máquina estará funcionando.

# Conexión mediante ssh

Desde el terminal podemos conectarnos usando la clave privada con el siguiente comando:

```bash
$ ssh -i <ruta a kc-devops.pem> ubuntu@<ip o dns de la máquina>
```
## Primeras acciones

### Actualizar el sistema

Lo primero que voy a hacer es actualizar el sistema utilizando `apt-get`

```bash
$ sudo apt-get update
$ sudo apt-get upgrade
```
Para hacerlo todo en una sola instrucción:

```bash
$ sudo apt-get update && sudo apt-get upgrade -y
```
### Cambiar el puerto de acceso ssh

Esta es una operación delicada, ya que podemos perder el acceso a la máquina si no tenemos cuidado.

Lo primero será editar el archivo de configuración del servicio ssh:

```bash
$ sudo vim /etc/ssh/sshd_config
```

Lo que hay que cambiar es el puerto, así que buscamos la línea que indica `Port 22`, que se encuentra al principio del archivo y lo cambiamos por el número de puerto que queremos usar, en este caso el XXXX, que es el que hemos abierto en el firewall del grupo de seguridad al crear la máquina virtual.

```
Port XXXX
```

Una vez modificado el archivo hay que recargar el servicio SSH. Como esta operación es delicada, es mejor utilizar `reload` que `restart` ya que el segundo nos cerraría la sesión remota actual impidiéndonos arreglar cualquier cosa que fallase en la configuración.

```bash
$ sudo service ssh reload
```

Para probar que toda la configuración es correcta vamos a abrir **otra conexión ssh sin cerrar la actual** y, en este caso debemos especificar el puerto con el modificador `-p`

```bash
$ ssh -i <ruta/archivo.pem> -p <puertossh> ubuntu@<ipservidor>
```

Si todo ha ido bien, esta será la forma de conexión a partir de ahora y podemos cerrar la conexión anterior. En caso contrario, esta segunda conexión no se abrirá y podemos usar la primera para solucionar cualquier problema de configuración.

**Si alguna vez perdemos el acceso a la máquina por SSH** y necesitamos configurar de nuevo el servicio, el mecanismo que podemos usar sería conectar el disco a otra máquina virtual y editar los archivos de configuración desde la otra máquina. Volviendo a poner el disco en la máquina original cuando hayamos acabado de reconfigurar.

# Instalar servidor web

Para esta práctica usaremos como servidor web **nginx** un servidor web rápido. ligero y que puede actuar como proxy inverso y dar soporte a nuestra aplicación nodepop. Para ello basta con utilizar el gestor de paquetes apt-get:

```bash
$ sudo apt-get install nginx
```

Recuerda que el puerto 80 debe estar abierto en el firewall de la máquina virtual. Si no lo has hecho antes, ahora es un buen momento para hacerlo.

Lo primero que vamos a hacer es deshabilitar la posibilidad de que nginx envíe información de qué sistema / servidor es para evitar dar información extra a cualquier atacante.

Para esto lo que vamos a hacer es descomentar en el archivo `/etc/nginx/nginx.conf` quitando la almohadilla del inicio de la línea.

```
# server_tokens off;
```

## Web estática

Lo primero será descargar la web estática. Lo voy a hacer directamente desde el repositorio de github y en el directorio `/var/www/html5`.

```bash
$ git clone --depth=1 https://github.com/tonybolanyo/kc-web3-html5-css3-js.git /var/www/html5
```

Esto lo descargará en la carpeta html5 y solamente recogerá la última versión (no necesitamos todo el historial de versiones).

### DNS

En nuestro proveedor creamos un registro A con el subdominio que queremos usar apuntando a la IP del servidor. Este paso no tiene mayor misterio.

### Configuración del sitio en nginx

El siguiente paso será crear un archivo de configuración en `/etc/nginx/sites-available` con la información de nuestro sitio web estático. El archivo será más o menos éste:

```nginx
server {
        listen 80 default;
        listen [::]:80 default;

        root /var/www/html5;

        index index.html index.htm;

        server_name ec2-52-202-12-11.compute-1.amazonaws.com;

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
}
```

Al marcarlo como default, será el que se muestre cuando no coincida con ningún dominio, y por tanto, también al acceder por IP.

Para probar la configuración de nginx y reiniciar el servicio:

```bash
$ sudo nginx -t
$ sudo service nginx reload
# también podemos recargar a través de systemctl
$ sudo systemctl reload nginx.service
```

# Desplegar aplicación node

## Instalar node y crear usuario para ejecutar apps

Buscar la opción de instalar mediante gestor de paquetes y ejecutar estas dos instrucciones:

```bash
$ curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```
Para correr las aplicaciones nodes vamos a crear un usuario `node` y bloqueamos la posibilidad de que inicie sesión interactiva.

```bash
$ sudo adduser node
$ sudo passwd -l node
```

## Descargar la aplicación e instalar dependencias

Nos convertimos en el usuario node, clonamos el repositorio (sólo la última versión)

```bash
$ sudo -u node -i
$ git clone --depth=1 https://github.com/tonybolanyo/kc-nodepop
$ cd kc-nodepop
$ npm install
$ npm run build
```

## Instalar pm2

Como usario ubuntu

```bash
$ sudo npm install pm2 -g
```

## Arrancar la aplicación y configurarla para el inicio

```bash
$ sudo -u node -i
$ cd kc-nodepop
$ pm2 start ./bin/www --name nodepop
$ pm2 save
$ pm2 startup
```

Copiamos el comando que nos enseña por pantalla y cerramos la sesión del usuario node, para ejecutar el comando como usuario ubuntu.

```bash
$ logout
$ sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u node --hp /home/node
```

Si ahora reiniciamos el sistema la aplicación debe iniciarse automáticamente.

### nginx como proxy inverso
Ahora tenemos que hacer que nodepop se sirva a través de nginx, es decir, utilicemos nginx coo un proxy inverso. El primer paso es crear un nuevo sitio en nginx, creando el archivo `/etc/nginx/sites-available/nodepop` con el siguiente contenido:

```nginx
server {
        listen 80;
        server_name nodepop.tonygb.com;

		# servimos los archivos css, js e imágenes
		# directamente con nginx (y no con express)
        location ~^/(css/|images/|js/) {
                root /home/node/kc-nodepop/public;
                # las quitamos del log de la aplicación
                access_log off;
                # máximo tiempo de expiración para la caché
                expires max;
                # cabecera personalizada para distinguirla desde chrome dev-tools
                add_header X-Owner tonybolanyo;
        }

        location / {
                proxy_set_header Host $http_host;
                proxy_pass http://127.0.0.1:3000/;
                proxy_redirect off;
                # Habilitar websockets (la versión de http es opcional)
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";
        }
}
```
 Hacemos un link simbólico en `sites-enabled` y si la configuración es correcta recargamos nginx
```bash
$ sudo ln -s /etc/nginx/sites-available/nodepop /etc/nginx/sites-enabled/nodepop
$ sudo nginx -t
$ sudo service nginx reload
```

## Instalar mongo

Tiramos de documentación oficial: https://docs.mongodb.com/master/tutorial/install-mongodb-on-ubuntu/?_ga=2.146612276.1402916667.1510602630-837608535.1444613486

```bash
$ sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
$ echo "deb [ arch=amd64,arm64 ] http://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/testing multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
$ sudo apt-get update
$ sudo apt-get install -y mongodb-org
$ sudo systemctl start mongod
$ sudo systemctl enable mongod
```

Crear los usuarios. Primero el administrador. Abrimos mongo y hacemos:
```mongo
use admin
db.createuser({
  user: "<nombre_usuario>",
  pwd: "<contraseña_segura>",
  roles: [{
	  role: "adminAnyDatabase",
	  db: "admin"
	},{
	  role: "readWriteAnyDatabase",
	  db: "admin"
	}
  }]
})
```

Y también el que va a usar node:

```mongo
db.createuser({
  user: "<usuario_nodepop>",
  pwd: "<contraseña_nodepop>",
  roles: [{
    role: "readWrite",
    db: "nodepop"
  }]
})
```

Editamos el archivo `/etc/mongod.conf` cambiando la sección comentada #security para agregar estas líneas:

```conf
# security
security:
  authorization: enabled
```

Para que surta efecto el cambio:

```bash
$ sudo service mongod restart
```

## Configurar aplicación con variables de entorno

Como necesitamos definir la configuración de la conexión con el nuevo usuario y contraseña para que todo funcione. Con el usuario `node` y en su directorio `home` vamos a crear el archivo `pm2_apps.config.js` que nos permita definir la configuración de nuestras aplicaciones. El contenido inicial será el siguiente:

```js
module.exports = {
  apps: [ 
    {
      name: "nodepop",
      script: "./kc-nodepop/bin/www"
      env: {
	    # usuario y contraseña de acceso a mongo
        "NODEPOP_DBUSER": "<usuario_nodepop>",
        "NODEPOP_DBPASSWORD": "<contraseña>",
        # parte secreta para la firma de los JWT
        "JWT_SECRET": "<palabra_secreta>",
        # acceso a la cola RabbitMQ en cloudamqp
        "AMQP_URL": "amqp://<ruta_acceso_cloudamqp>"
      }
    }
  ]
}
```

Ten en cuenta que la extensión `.config.js` es un requisito de pm2 para el archivo de configuración de aplicaciones.

Para que pm2 utilice esta configuración lo primero será parar y eliminar la aplicación anterior, ejecutarla a través de esta configuración y, después de comprobar que todo ha ido bien, volver a guardarlo para que se inicie de esta manera en el caso de que el servidor se reinicie.

```bash
$ pm2 stop nodepop
$ pm2 delete nodepop
$ pm2 start pm2_apps.config.js
$ pm2 list
# ahora en la lista debe aparecer nodepop como NodePop
$ pm2 save
```

Si ahora reiniciamos el servidor, todo debería funcionar correctamente.

# Establecer acceso por HTTPS

Lo vamos a hacer con letsencrypt. El primer paso será instalar el robot que nos va a permitir generar y renovar nuestro certificado. Además es capaz de configurar nuestro servidor casi de forma automática. Instalaremos **certbot** siguiendo las instrucciones de la propia web: https://certbot.eff.org/#ubuntutyakkety-nginx

```bash
$ sudo apt-get update
# lo más seguro es que esto ya lo tengamos instalado
$ sudo apt-get install software-properties-common
$ sudo add-apt-repository ppa:certbot/certbot
$ sudo apt-get update
$ sudo apt-get install python-certbot-nginx

# una vez instalado podemos generar el certificado
# y configurar nginx con un asistente ejecutando
$ sudo certbot --nginx
```

>**ADVERTENCIA:** Antes de realizar la ejecución del asistente para la generación, asegúrate de que el puerto 443 (el de https) no está bloqueado en el firewall del servidor.

Si todo ha ido bien, solamente nos queda recargar la nueva configuración de nginx para que los cambios sean efectivos.
