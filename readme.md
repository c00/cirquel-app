# Cirque App 

The crowd-sourced dictionary app for all things Cirque! Aerials, Lyra, Trapeze. We'll even throw in acro balance, calisthenics and flexibility!

Cirque App is an Open Source community project. 

## Coming new features

Right after the MVP, these are features that would really improve the whole thing
- Profile modification / deletion
- Search on popularity
- Password reset Email
- Follow users
- Comments on tricks
- Add wishlists
- Venue management

## Future ideas

- Upload private photos and videos
- Keep track of progress of tricks
- Set goals, get reminders (e.g. "Go work on your splits!")
- Create / share workout routines (for warming up / stretching / whatever)
- Add tutorials for tricks, with detailed images / videos / text (crowd-sourced)
- Create routines (multiple tricks in a row)
- Share (titles of) great music for performances

## Things we should probably fix

Card for voting on name should probably have a max height and scroller.

# Vision for the future

This app is free, open-source and without ads. This will never change. I can imagine a future where we create some freemium model to compensate for the infrastructure and maintenance costs, but the idea is initially to serve the cirque community, while not costing me (too much) money. 

Future functionality should be largely influenced by the community. I am always open to feedback, feature requests, bugs, or any thoughts, positive or negative, on the app.

I want users to use the app to find new tricks, document stuff they've done, mark their progress on their skills, 

# Contribute

If you can and want to help out in any capacity, contact me at `cirqueapp at covle dot com`. Things I need:

- Designers (logos, color schemes)
- Developers (Hybrid Apps, Ionic, Cordova, TypeScript, Angular2+, PHP / symfony)
- Translators. The app is built for multiple languages!
- Content creators (Videos, pictures)
- Moderators (Rate content, deal with abuse, etc.)
- Social Media people to spread the word!
- Creative folks (Please think if a good name for the project!)
- Normal users, people who give feedback, think of new features, etc!

## Build and development quirks

## Android Build error (Firebase / Support library)

Related: https://stackoverflow.com/questions/51747801/ionic-3-execution-failed-for-task-appprocessdebugmanifest

Fix:

1. Open `platforms/android/app/src/main/AndroidManifest.xml`
2. Add the following namespace to the `<manifest>` tag `<manifest [...] xmlns:tools="http://schemas.android.com/tools">`
3. Under `<Application>` add the following element: `<meta-data android:name="android.support.VERSION" android:value="26.1.0" tools:replace="android:value" />`

Possibly do `cordova clean` to unfuck the current build.

## Firebase Setup
Place your `google-services.json` and the IOS one into the root folder of the project to have it picked up by the FireBase plugin.

## Android custom Notification Icon

Add this to `AndroidManifest.xml`
```
<meta-data android:name="com.google.firebase.messaging.default_notification_icon" android:resource="@drawable/ic_notification" />
```
Then extract the zip file: `resources/android/ic_notification.zip` to `platforms/android/src/main`.

Then pray to whatever god you believe in, and build.
todo: Automate this stuff so that it's not longer a manual action.
