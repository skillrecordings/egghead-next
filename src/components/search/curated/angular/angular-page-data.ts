const angularPageData = [
  {
    id: 'beginner',
    title: 'Beginner',
    name: 'Get Started',
    resources: [
      {
        byline: 'Sam Julien・1h 13m・Course',
        path: '/courses/angular-basics-888f',
        slug: 'angular-basics-888f',
        title: 'Learn Angular Basics',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/full/angular2.png',
      },
      {
        byline: 'John Lindquist・23m・Course',
        path: '/courses/learn-the-basics-of-angular-forms',
        slug: 'learn-the-basics-of-angular-forms',
        title: 'Learn the Basics of Angular Forms',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/735/full/EGH_A2_Forms_Final.png',
      },
      {
        byline: 'Christoph Burgdorf・11m・Course',
        path: '/courses/build-an-angular-instant-search-component',
        slug: 'build-an-angular-instant-search-component',
        title: 'Build an Angular Instant Search Component',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/495/full/EGH_A2_Instasearch.png',
      },
    ],
  },
  {
    id: 'intermediate',
    title: 'Intermediate',
    name: 'Hitting Your Stride',
    resources: [
      {
        byline: 'Pascal Precht・27m・Course',
        path: '/courses/angular-dependency-injection-di-explained',
        slug: 'angular-dependency-injection-di-explained',
        title: 'Angular Dependency Injection (DI) Explained',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/541/full/EGH_A2_DependencyEngine_Final.png',
      },
      {
        byline: 'Juri Strumpflohner・40m・Course',
        path: '/courses/getting-started-with-angular-elements',
        slug: 'getting-started-with-angular-elements',
        title: 'Getting Started with Angular Elements',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/456/full/EGH_AngularElements_Final.png',
      },
      {
        byline: 'Nathan Walker・43m・Course',
        path: '/courses/create-native-mobile-apps-with-nativescript-for-angular',
        slug: 'create-native-mobile-apps-with-nativescript-for-angular',
        title: 'Create Native Mobile Apps with NativeScript for Angular',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/705/full/EGH_AngularNativeScript_Final.png',
      },
    ],
  },
  {
    id: 'advanced',
    title: 'Advanced',
    name: 'Above And Beyond',
    resources: [
      {
        byline: 'John Lindquist・28m・Course',
        path: '/courses/understand-angular-directives-in-depth',
        slug: 'understand-angular-directives-in-depth',
        title: 'Understand Angular Directives in Depth',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/729/full/EGH_A2_Directives_Final.png',
      },
      {
        byline: 'Bram Borggreve・28m・Course',
        path: '/courses/seo-friendly-progressive-web-applications-with-angular-universal',
        slug: 'seo-friendly-progressive-web-applications-with-angular-universal',
        title: 'SEO Progressive Applications with Angular Universal',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/708/full/EGH_Angular-Universal_1000.png',
      },
      {
        byline: 'Nathan Walker・1h 9m・Course',
        path: '/courses/use-objective-c-swift-and-java-api-s-in-nativescript-for-angular-ios-and-android-apps',
        slug: 'use-objective-c-swift-and-java-api-s-in-nativescript-for-angular-ios-and-android-apps',
        title: 'Create Angular iOS and Android Apps',
        image:
          'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/496/full/EGH_AngularNS_Mobile_Final-01.png',
      },
    ],
  },
  {
    id: 'feature-podcast',
    name: 'Learn architecture patterns',
    title:
      'Angular Web Applications with Juri Strumpflohner and Rob Wormald (Angular Core Team)',
    description: `John talks with Juri Strumpflohner, an industry expert and angular trainer; and Rob Wormald, an Angular core development team member, getting into how Angular has evolved with the 2.0 release, powerful new features, their favorite libraries, and where the future is taking it.`,
    byline: 'John Lindquist・39m・Podcast Episode',
    path: '/podcasts/angular-web-applications-with-juri-strumpflohner-and-rob-wormald-angular-core-team',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/tags/images/000/000/300/full/angular2.png',
  },
  {
    id: 'feature-course',
    image: `https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/529/full/EGH_AngularServicesDI-2.png`,
    byline: 'Juri Strumpflohner・46m・Course',
    description:
      'Services and registering service providers are an inherent part of an Angular application. It is where you should define your application logic, they keep the state of the application and allow to share that among different components.',
    path: '/courses/angular-service-injection-with-the-dependency-injector-di',
    slug: 'angular-service-injection-with-the-dependency-injector-di',
    title: 'Angular Service Injection with the Dependency Injector (DI)',
  },
  {
    id: 'secondary-feature-course',
    title: 'Advanced Angular Component Patterns',
    byline: 'Isaac Mann・31m・Course',
    path: '/courses/advanced-angular-component-patterns',
    slug: 'advanced-angular-component-patterns',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/514/full/EGH_AdvAngularPatts_Final.png',
  },
  {
    id: 'state-management-course-one',
    byline: 'John Lindquist・31m・Course',
    path: '/courses/manage-ui-state-with-the-angular-router',
    slug: 'manage-ui-state-with-the-angular-router',
    title: 'Manage UI State with the Angular Router',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/692/full/EGH_A2_Router.png',
  },
  {
    id: 'state-management-course-two',
    byline: 'Lukas Ruebbelke・1h 25m・Course',
    path: '/courses/reactive-state-management-in-angular-with-ngrx',
    slug: 'reactive-state-management-in-angular-with-ngrx',
    title: 'Reactive State Management in Angular with ngrx',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/627/full/EGH_ngrxAngular_Final.png',
  },
  {
    id: 'state-management-course-three',
    byline: 'John Lindquist・41m・Course',
    path: '/courses/build-redux-style-applications-with-angular-rxjs-and-ngrx-store',
    slug: 'build-redux-style-applications-with-angular-rxjs-and-ngrx-store',
    title: 'Build Redux Style Applications with Angular',
    image:
      'https://d2eip9sf3oo6c2.cloudfront.net/playlists/square_covers/000/432/525/full/build-angular-app-redux-ngrx-sq.png',
  },
]

export default angularPageData
