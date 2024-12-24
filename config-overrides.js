const { alias } = require('react-app-rewire-alias');

module.exports = function override(config) {
  alias({
    'mapbox-gl': 'maplibre-gl'
  })(config);

  return config;
};