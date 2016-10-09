const pipes = {};

pipes.css = (name, options) => {
  return lazypipe()
    .pipe(concat, options.filename)
    .pipe(cleanCSS);
  // return pipeline.pipe(concat(options.filename))
  //   .pipe(cleanCSS());
};

pipes.js = (name, options) => {
  return lazypipe()
    .pipe(concat, options.filename)
    .pipe(ngAnnotate)
    .pipe(uglify);
  // return pipeline.pipe(concat(options.filename))
  //   .pipe(ngAnnotate())
  //   .pipe(uglify({}));
};

pipes.html = (name, options) => {
  return lazypipe()
    .pipe(concat, options.filename);
  //return pipeline.pipe(concat(options.filename));
    // .pipe(ejs({}))
    // .pipe(ngmin())
    // .pipe(htmlmin({collapseWhitespace: true}))
    // .pipe(uglify().on('error', function(e){
    //    console.log(e);
    // }));
};

pipes.copy = (name, options) => {
  return pipeline;
};

const pipe = (name, options, iteratee) => {
  // if(_.isUndefined(pipeline)) {
  //   pipeline = gulp.src(options.src);
  // } else {
  //   pipeline.pipe(gulp.src(options.src));
  // }
  let pipeline = gulp.src(options.src);

  if(iteratee) {
    pipeline.pipe(iteratee(name, options)); //= iteratee(pipeline, name, options);
  }

  if(options.rev) {
    pipeline.pipe(rev());
  }

  pipeline.pipe(gulp.dest(options.dest));

  if(options.rev) {
    pipeline.pipe(rev.manifest({
      // base: 'build/assets',
      merge: true
    }))
    .pipe(gulp.dest(`client_src/rev-manifests`));
    // pipeline.pipe(rev.manifest(`manifest-${name}.json`))
    //   .pipe(gulp.dest(`client_src/rev-manifests`));
  }

  return pipeline;
};

const createTasksFor = (name, tasksOptions) => {
  let typeNames = _.keys(tasksOptions);
  let types = _.map(typeNames, typeName => `${name}-${typeName}`);

  // gulp.task(name, [`${name}-clean`].concat(types));
  //
  // gulp.task(`${name}-clean`, function () {
  //   return gulp.src(`public/dist/${tasksOptions.destRoot}/${name}`, {read: false})
  //     .pipe(clean());
  // });

  gulp.task(name, ['clean'], () => {
    let pipeline;
    _.forOwn(tasksOptions, (options, type) => {
      if(_.has(pipes, type)) {
        let iteratee = pipes[type];
        if(_.isArray(options) === false) options = [options];

        _.forEach(options, (instructions) => {
          pipe(name, instructions, iteratee);
        });

        //pipe(pipeline, name, options[0], iteratee);
      }
    });
    return pipeline;
  });

  // _.forOwn(tasksOptions, (options, type) => {
  //   if(_.has(pipes, type)) {
  //     gulp.task(`${name}-${type}`, ['clean', `${name}-clean`], () => {
  //       let pipe
  //     });
  //   }
  // });
};
