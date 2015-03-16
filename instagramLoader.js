(function ($) {
  function InstagramLoader(element) {
    this.element = element;
    this.$element = $(element);

    this.count = 0;

    this.$element.on(
      "instagram-images-load",
      $.proxy(this.load, this)
    )
    .on(
      "instagram-images-load-more",
      $.proxy(this.loadMore, this)
    );

  }

  InstagramLoader.prototype.getMaxPages = function getMaxPages() {
    return this.$element.data('max-pages') || 3;
  };

  InstagramLoader.prototype.getItemsPerGroup = function getItemsPerGroup() {
    return this.$element.data('items-per-group') || 6;
  };

  InstagramLoader.prototype.getUserId = function getUserId() {
    return this.$element.data('user-id');
  };

  InstagramLoader.prototype.getCount = function getCount() {
    return this.$element.data('pull-count') || 18;
  };

  InstagramLoader.prototype.getParams = function getParams() {
    return {
      type:     'GET',
      dataType: 'jsonp',
      url:      'https://api.instagram.com/v1/users/' + this.getUserId() + '/media/recent',
      data: {
        max_id: this.nextMaxId,
        count: this.getCount(),
        client_id: this.$element.data('client-id')
      },
      success: $.proxy(this.loadSuccess, this)
    };
  };

  InstagramLoader.prototype.load = function load() {
    $.ajax(this.getParams());
  };

  InstagramLoader.prototype.loadSuccess = function loadSuccess(response) {
    this.count = this.count + 1;

    this.nextMaxId = response.pagination.next_max_id;

    this.$element.trigger('instagram-images-loaded', response);

  };

  InstagramLoader.prototype.loadMore = function loadMore() {
    if (this.count < this.getMaxPages()) {
      setTimeout($.proxy(this.load, this), 500);
    }
  };

  $('[instagram-loader]').each(function (index, element) {
    $(element).data('instagram-loader', new InstagramLoader(element));
  });
}(jQuery));
