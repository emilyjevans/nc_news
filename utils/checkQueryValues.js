function checkQueryValues(sort_by, order, topic) {
    const sortByEntries = [
        'author',
        'title',
        'article_id',
        'body',
        'topic',
        'created_at',
        'votes',
      ];

    const orderByEntries = [
        'asc', 'desc'
    ]
      if(!sortByEntries.includes(sort_by) || !orderByEntries.includes(order)){
        return Promise.reject({
          status: 400,
          msg: "Bad request",
        });
    }
    }