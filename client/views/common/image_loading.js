Template.image_loading.viewmodel({
    isLoading : true,
    onRendered : function(){
        var self = this;
        var imageSrc = self.templateInstance.data;
        var image = self.templateInstance.find('img');
        var downloadingImage = new Image();
        downloadingImage.onload = function(){
            image.src = this.src;
            self.isLoading(false);
        };
        downloadingImage.src = imageSrc;
    }
})