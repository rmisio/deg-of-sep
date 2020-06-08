let _getData = null;

export default function() {
  if (_getData) return _getData;

  const now = Date.now();

  let _reject;

  const promise = new Promise((resolve, reject) => {
    _reject = reason => {
      _getData = null;
      reject(reason);
    };

    // todo: test an error here
    Promise.all([
      import ('data/teams'),
      import ('data/rosters'),
      import ('data/players'),
    ])
      .then(data => resolve(
        data.reduce((acc, item, index) => {
          if (index === 0) {
            acc.teams = item.default;
          } else if (index === 1) {
            acc.rosters = item.default;
          } else {
            acc.players = item.default;
          }

          return acc;
        }, {})
      ))
        .catch(() => (_getData = null));
  });

  _getData = {
    now,
    promise,
    cancel: () => _reject('canceled'),
  }

  return _getData;
}