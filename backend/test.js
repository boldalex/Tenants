const request = require('request');

// request.post('http://localhost:3000/api/user/login',{json:{ email: 'test2@test.com', password: '123'}},
//   (err,res,body) => {
//     if(err){
//       console.log(err);
//     }
//     console.log(`statusCode: ${res.statusCode}`);
//     console.log(body);
// });

// request.post('http://localhost:3000/api/flats/',{json:{ addressId: 10, flatNumber: 100}}, (err,res,body) => {
//   if (err){
//     console.log(err);
//   }
//   console.log(body);
// });

// request.post('http://localhost:3000/api/flats/',
//   {json:{ city: 'Москва', admAreaId: 5, districtId: 1, street: 'Гоголя',propertyTypeId:1,propertyNumber:56,
//   latitude:50.586,longitude:50.8494, flatNumber: 72 }}, (err,res,body) => {
//   if (err){
//     console.log(err);
//   }
//   console.log(body);
// });

// request.post('http://localhost:3000/api/feedbacks/',
//   {json:{ flatId: 6, userId: 2, feedbackDate: new Date(), neighborhood_r: 3, neighborhood_c: 'Одни алкаши',
//   flat_r: 4, flat_c: 'Пойдёт', location_r: 4, location_c: 'Далеко', owner_r: 4, owner_c: 'Мудак', infrastructure_r: 3,
//   infrastructure_c: 'Всё есть', general_c: 'Такое себе' }}, (err,res,body) => {
//   if (err){
//     console.log(err);
//   }
//   console.log(body);
// });

// request.get('http://localhost:3000/api/feedbacks/1', (err,res,body) => {
//   if (err){
//     console.log(err);
//   }
//   console.log(body);
// });

request.get('http://localhost:3000/api/flats/2', (err,res,body) => {
  if (err){
    console.log(err);
  }
  console.log(body);
});

// request.get(encodeURI('http://localhost:3000/api/flats/лен'), (err,res,body) => {
//   if (err){
//     console.log(err);
//   }
//   console.log(body);
// });

// request.get('http://localhost:3000/api/addresses/', (err,res,body) => {
//   if (err){
//     console.log(err);
//   }
//   console.log(body);
// });

