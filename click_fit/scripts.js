$(document).ready(function () {
    var images = [
        './dist/images/alora-griffiths-sAKQGX1Krs8-unsplash.jpg',
        './dist/images/anastase-maragos-7kEpUPB8vNk-unsplash.jpg',
        './dist/images/alora-griffiths-sAKQGX1Krs8-unsplash.jpg',
        './dist/images/victor-freitas-WvDYdXDzkhs-unsplash.jpg'
    ];
    var currentIndex = 0;
    var imageElement = $('.hero');

    function changeBackground() {
        currentIndex = (currentIndex + 1) % images.length;
        var imageUrl = 'url(' + images[currentIndex] + ')';
        imageElement.css('background-image', imageUrl,{
            opacity:0.5,
        });

    }
    changeBackground();

    setInterval(changeBackground, 3000);
    $.ajax({
        url: 'http://numbersapi.com/1/30/date?json',
        method: 'GET',
        success: function (data) {
            $('#content').html(data.text); 
            $('#informationArea').html(data.text);
        }
    });





    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        $('#dropArea')[0].addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }


    ['dragenter', 'dragover'].forEach(eventName => {
        $('#dropArea')[0].addEventListener(eventName, () => {
            $('#dropArea').addClass('hover');
        }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        $('#dropArea')[0].addEventListener(eventName, () => {
            $('#dropArea').removeClass('hover');
        }, false);
    });


    $('#dropArea')[0].addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        handleFiles(files);
    }


    $('#fileInput').on('change', function () {
        let files = $(this)[0].files;

        handleFiles(files);
    });

    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            if (file.type.match('image.*')) {
                previewImage(file);
                uploadFile(file);
            }
        }
    }

    function previewImage(file) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
            $('#preview').append(`<img src="${e.target.result}" class="thumbnail">`);
        };
    }

    function uploadFile(file) {
        let formData = new FormData();
        formData.append('file', file);


        $.ajax({
            url: 'http://localhost:3000/upload',
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (data) {
                window.alert("file uploaded")
            },
            error: function (error) {
                window.alert("upload failed")
                console.error('Error uploading file:', error);
            }
        });
    }

    
});