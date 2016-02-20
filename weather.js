if (Meteor.isClient) {

  Template.weather.helpers({
    city: function () {
      return Session.get('city');
    },
    description: function () {
      return Session.get('description');
    },
    temperature: function () {
      return Session.get('temperature');
    },
    icon: function () {
      return Session.get('icon');
    }
  });

  Template.weather.events({
    "submit .zip-code": function (event) {
      // Prevent default browser form submit
      event.preventDefault();
 
      // Get value from form element
      var zip = event.target.zip.value;
 
      // Call the api and populate the template
      Meteor.call('weather', zip, function(err,res){ 
        console.log(res);
        Session.set('city', res.name);
        Session.set('description', res.weather[0].description);
        Session.set('temperature', Math.round(res.main.temp) + '°');
        Session.set('icon', res.weather[0].icon);
      });
 
      // Clear form
      event.target.zip.value = "";
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
  // The method expects a valid US zip code
  'weather': function (zip) {
    console.log('Get weather for', zip);
    // Construct the API URL
    var apiKey = Meteor.settings.apiKey;
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=' + zip + ',us&units=imperial&APPID=' + apiKey;
    // query the API
    var response = HTTP.get(apiUrl).data;
    return response;
    }
  });
}
