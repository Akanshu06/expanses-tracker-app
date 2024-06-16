const AWS = require("aws-sdk");

const uploadtoS3=(filename,data)=> {
    
    const IAM_USER_KEY = process.env.iam_user_key;
    const IAM_USER_SECRET = process.env.iam_access_key;
    let s3bucket = new AWS.S3({
      accessKeyId: IAM_USER_KEY,
      secretAccessKey: IAM_USER_SECRET,
     
    });

      var params = {
        Bucket: process.env.bucket_name,
        Key: filename,
        Body: data,
        ACL:'public-read'
      };

      return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
          if (err) {
            console.log('something went wrong', err);
            reject(err); // Pass the error object to the reject function
          } else {
            console.log('success', s3response);
            resolve(s3response.Location);
          }
        });
      });
      
  };


module.exports={
    uploadtoS3
}