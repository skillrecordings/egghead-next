const sortingHat: any = {
  version: '1.0.0',
  biggest_path: {
    heading: `Welcome!`,
    subheading: `What brings you here today?`,
    type: `multiple-choice`,
    first: true,
    random: true,
    other: true,
    other_label: `something else`,
    choices: [
      {
        answer: `leveling_up`,
        label: `Level up my programming skills`,
      },
      {
        answer: `optimizing_code`,
        label: `Help on a specific web development project`,
      },
    ],
    next: {
      leveling_up: `level_up_reason`,
      optimizing_code: `optimizing_reason`,
      other: `egghead_help_freeform`,
    },
  },
  level_up_reason: {
    heading: `Oh nice, you're working on your dev skills!`,
    subheading: `What's your biggest motivation?`,
    type: `multiple-choice`,
    random: true,
    other: true,
    other_label: `none of the above`,
    choices: [
      {
        answer: `bigger_projects`,
        label: `Working on bigger projects`,
      },
      {
        answer: `advancing_career`,
        label: `Getting a good/better developer job`,
      },
      {
        answer: `new_role`,
        label: `Just took a new role`,
        always_last: true,
      },
    ],
    next: {
      open_source: ``,
      bigger_projects: `level_up_goal`,
      advancing_career: `last_portfolio_update`,
      new_role: `level_up_goal`,
      other: `egghead_help_freeform`,
    },
  },
  optimizing_reason: {
    heading: `Ok, you're working on a specific code project!`,
    subheading: `What's the biggest concern?`,
    type: `multiple-choice`,
    random: true,
    other: true,
    other_label: `none of the above`,
    choices: [
      {
        answer: `maintainability`,
        label: `Better maintainability of code base`,
      },
      {
        answer: `performance`,
        label: `Faster performance`,
      },
      {
        answer: `best_practice`,
        label: `Using modern best practices`,
      },
      {
        answer: `launch_prep`,
        label: `Launching for real users`,
      },
    ],
    next: {
      best_practice: `thanks`,
      performance: `thanks`,
      maintainability: `thanks`,
      launch_prep: `thanks`,
      other: `egghead_help_freeform`,
    },
  },
  egghead_help_freeform: {
    heading: `Ohh, tell us more!`,
    subheading: `What **are** you hoping egghead can help you with, in the big picture? Feel free to write as much as you like. We are excited to read it.`,
    type: `multi-line`,
    other: true,
    other_label: `I'd rather not say...`,
    next: {
      other: `opt_out`,
      all: `thanks`,
    },
  },
  last_portfolio_update: {
    heading: `Career Advancement. Gotcha.`,
    subheading: `When did you last update your developer portfolio?`,
    type: `multiple-choice`,
    random: true,
    other: true,
    other_label: `what's a developer portfolio?`,
    choices: [
      {
        answer: `recently`,
        label: `Recently. It's up to date!`,
      },
      {
        answer: `been_awhile`,
        label: `It's been a while...`,
      },
      {
        answer: `no_portfolio`,
        label: `I don't have a developer portfolio.`,
      },
    ],
    next: {
      recently: `portfolio_outreach`,
      been_awhile: `portfolio_outreach`,
      no_portfolio: `portfolio_outreach`,
      other: `portfolio_faq`,
    },
  },
  portfolio_faq: {
    heading: `Want to learn more?`,
    subheading: `We think developer portfolios are a great lever for career advancement.`,
    type: `cta-link`,
    url: `https://joelhooks.com/developer-portfolio`,
    button_label: `Click to Learn More`,
  },
  level_up_goal: {
    heading: `OK, working on bigger projects.`,
    subheading: `Which do you think would unlock more ambitious dev projects?`,
    type: `multiple-choice`,
    random: true,
    other: true,
    other_label: `something else`,
    choices: [
      {
        answer: `newer_skills`,
        label: `Getting a more modern skill set`,
      },
      {
        answer: `full_stack`,
        label: `Becoming a more "full stack" developer`,
      },
      {
        answer: `beyond_basics`,
        label: `Advancing beyond the basics on real-world projects`,
      },
    ],
    next: {
      beyond_basics: `thanks`,
      full_stack: `thanks`,
      newer_skills: `thanks`,
      other: `bigger_project_freeform`,
    },
  },
  bigger_project_freeform: {
    heading: `Ohh, "something else" you say?`,
    subheading: `How can we help you start working on bigger projects? Feel free to write as much as you like. We are excited to read it.`,
    type: `multi-line`,
    other: true,
    other_label: `I'd rather not say...`,
    next: {
      other: `opt_out`,
      all: `thanks`,
    },
  },
  portfolio_outreach: {
    heading: `Understood!`,
    subheading: `Would it be ok if one of us reached out to chat about this? 
Not a sales call, just trying to learn more about developers in your situation.`,
    type: `multiple-choice`,
    choices: [
      {
        answer: `ok`,
        label: `Sure, you can reach out`,
      },
      {
        answer: `no`,
        label: `No thanks`,
      },
    ],
    next: {
      no: `opt_out`,
      ok: `talk_soon`,
    },
  },
  thanks: {
    heading: `We appreciate you!`,
    subheading: `Understanding your situation helps us showcase the resources that 
you'll find most useful.

Thanks for letting us know!`,
    type: `cta-done`,
    final: true,
    button_label: `Click to Close`,
  },
  talk_soon: {
    heading: `Awesome, thanks!`,
    image: `https://res.cloudinary.com/dg3gyk0gu/image/upload/v1608163615/value-paths/yohann_kunders.jpg`,
    subheading: `Be on the lookout for an email from Yohann. He's super easy to get along with and curious about your goals.`,
    final: true,
    type: `cta-email`,
    button_label: `Chat soon!`,
  },
  opt_out: {
    heading: `We understand.`,
    final: true,
    subheading: `We won't ask you any more of these questions.`,
    type: `opt-out`,
  },
}

export default sortingHat
