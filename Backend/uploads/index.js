require('ncp').ncp('./Backend/', './Published', error => {
    if(error) return console.log(error);
    console.log('done.')
})