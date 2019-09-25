import { db } from '../lib/db';
import Header from '../components/shared/Header';
import Footer from '../components/shared/Footer';
import React from 'react'

 export default class Posts extends React.Component {
  static async getInitialProps() {
    let result = await new Promise((resolve, reject) => {
      db.collection('posts')
      .get()
      .then(snapshot => {
        let data = []
        snapshot.forEach((doc) => {
          data.push(
            Object.assign({
              id: doc.id
            }, doc.data())
          )
        })
        resolve(data)
      }).catch(error => {
        reject([])
      })
    })
    return {posts: result}
  }

  handleDelete = (id) => {
    db.collection('posts')
    .doc(id)
    .delete()
    .then(function() {
      console.log("Document successfully deleted!");
    }).catch(function(error) {
      console.error("Error removing document: ", error);
    });
  }

  render() {
    const posts = this.props.posts
    return (
      <React.Fragment>
        <Header />
          <div>
            {posts.map(post =>
              <div className="post" key={post.id}>
                <h2>
                  {post.title}
                </h2>
                <p>
                  {post.body}
                </p>
                <button onClick={this.handleDelete.bind(this, post.id)}>削除</button>
              </div>
            )}
          </div>
        <Footer />
        <style jsx>{`
          .post {
            width: 40%;
            border: 1px solid black;
            background-color: gray;
            margin-bottom: 10px;
          }
        `}</style>
      </React.Fragment>
    );
  }
}