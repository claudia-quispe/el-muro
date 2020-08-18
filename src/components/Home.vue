<template>
    <div>
    <img class="welcome" alt="welcome" src="@/assets/welcome.png">
        <div class="rowHome">
            <div class="col s3 m3"></div>
            <div @submit.prevent="add_post">
                <form class="col s6">
                    <div class="rowHome">
                        <div class="input-field col s12">
                            <textarea id="textarea1" required v-model="texto_post" class="materialize-textarea"></textarea>
                                <button type="submit" class="btn" name="action">POST</button>
                            <label for="textarea1">Crea una publicación</label>  
                        </div>   
                    </div>
                </form>
                <div class="col s3 m3">
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col s3 m3"></div>
            <div class="col s6 m6">
                <ul class="post">
                    <li v-for="posteo in post" :key="posteo.id" class="collection-item avatar">
                        <span class="title">{{ posteo.usuario.nombre }}</span>
                        <p class="text">{{ posteo.texto }}<br>
                        <p class="fecha">{{ posteo.fecha }}
                            <a href="#" class="secondary-content">
                                 <i class="material-icons" @click.prevent="likes(posteo.id)">favorite</i>
                                <span class="like">{{ posteo.likes }}</span><br>
                            </a>
                        </p>    
                    </li>
                </ul>
            </div>
            <div class="col s3 m3"></div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import 'firebase/auth'
import { db } from '@/firebase';

const getDate = () => {
  const trailing = (d) => ('0' + d).slice(-2);
  const now = new Date();
  return `${now.getFullYear()}-${trailing(now.getMonth() + 1)}-${trailing(now.getDate())} ${trailing(now.getHours())}:${trailing(now.getMinutes())}:${trailing(now.getSeconds())}`;
}

export default {
    name: 'Home',
    data() {
        return {
            texto_post: '',
            post: []

        }
    },
    methods: {
        // acá va mi manejador añadir_post
        add_post() {
            //console.log('añadir post pescameeee');
            const usuario = firebase.auth().currentUser
            console.log(usuario);
            this.$firestore.post.add({
                fecha: getDate(),
                texto: this.texto_post,
                usuario: {
                    nombre: usuario.displayName,
                    id_usuario: usuario.uid
                },
                likes: 0,
            })
        },
        likes(post_id) {
            //console.log(post_id);
            // acá crecupero el post anterior por su id
            // el post.id corresponde al v-for de template
            const post = this.post.find(post => post.id == post_id);
            // acá actualizo en la base de datos
            this.$firestore.post.doc(post_id).update({
                likes: post.likes++

            })
        }     
    },
    // acá retornamos los post, nos traemos al objeto de la nube
    firestore() {
        return {
            post: db.collection('post')
        }
    },
}
</script>

<style>
.btn {
    margin: 10px;
    background-color:black;
}
.crear {
    width: 120px
}
.collection-item {
    border-radius: 10px;
    border: solid 1px white;
    margin: 25px 20px;
    padding: 15px;
    box-shadow: 2px 2px 5px rgb(192, 190, 190);
    
}
.material-icons {
    color:b;
}
.post {
    text-align: justify;
}
.title {
    text-align: justify;
    font-weight: bold;
    
}
.like {
    margin: auto;
    font-size: small;
    color: #a09e9e;

}
.secondary-content {
    color: black;
}
p {
    margin-top: 30px;
    margin-bottom: 0%;
    font-size: small;
}
.text {
    font-size:large;
    
}
.fecha {
    color: #a09e9e;
}
.input.field {
    border-radius: 10px;
    border: solid 1px white;
    box-shadow: 2px 2px 5px rgb(192, 190, 190);
}
.col .rowHome {
    padding: 1.5rem;
    border-radius: 10px;
    width: 605px;
    margin: auto;
    box-shadow: 2px 2px 5px rgb(192, 190, 190);
}

</style>

