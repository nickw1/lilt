# lilt 2 - Lightweight Interactive Learning Tool

**Now using Markdown and [@lazarv/react-server](https://react-server.dev)!**

## What is lilt?

`lilt` is a tool to allow students to actively participate in learning sessions by means of interactive exercises. When tutors are delivering learning material via a lecture or a talk, there is always a question as to whether the students are actually understanding the content. `lilt` allows tutors to check students' understanding by integrating lecture material with interactive exercises which students can answer in class. The tutor can then view submitted answers and the submitted answers can be discussed in class, to address common misunderstandings.

`lilt` also allows tutors to hide sections of the notes until particular exercises have been answered. This allows students to think through problems themselves and suggest their own ideas before the problem is discussed through the notes.

With `lilt` 2, tutors now write code in [Markdown](https://markdownguide.org) with custom extensions to support exercises and hidden content. There is now an included WYSIWYG (what-you-see-is-what-you-get) notes editor allowing tutors to write their notes via a graphical interface without necessarily knowing Markdown.

## What lilt is not

First of all, a quick word on what `lilt` is not. It is not, and does not aim to be, a full Virtual Learning Environment (VLE). Students do not provide their personal details at all, providing a private and anonymous environment. `lilt` does not aim to assess students over the period of a whole module, but just aims to check their understanding of the current topic.

It's also geared at tutors who are happy using Markdown to write their notes, or using a graphical editor which generates Markdown. It does not yet support PowerPoint slides for example and may not for some considerable time.

## Configuring and managing lilt

There are two roles involved in managing `lilt`:

- The sysadmin, who will install and configure `lilt` and add admin users via command-line tools;
- Tutors, who will login to `lilt` as an admin to manage modules, topics, exercises and questions via the web interface.

Tutors may be able to perform the sysadmin tasks themselves, if they have direct access to the intended hardware upon which `lilt` will be installed. If not, please ask the appropriate ICT staff to set up `lilt`.

As `lilt` servers are expected to be small-scale, servicing just a small number of classes of students at a time within a single institution, SQLite is used. 

## How to setup a lilt server (sysadmin)

### Install dependencies and build

You need [Node.js](https://nodejs.org) - at least version 20 - installed on your system.

`lilt` uses [@lazarv/react-server](https://react-server.dev) as its web development framework. You an optionally install the package management tool  [pnpm](https://pnpm.io).

Once installed do:

```
npm install
```

Then build:

```
npm react-server build
```

You can alternatively use `pnpm` rather than `npm`.


### Setup lilt 

Provided is a Node script `setup.mjs` in the `utils` directory. This takes care of setting up `lilt`, including specifying the location of the database and of the notes, and adding admin users.

If you run it, e.g.

```
node utils/setup.mjs
```
it will first ask you for the directory you wish to store the SQLite database (`lilt.db`) and the directory you wish to store the notes (which will be a subdirectory called `notes`). 

Please enter those directories. The setup tool will then exit. You will notice that in the main lilt directory, a file called `.env` has been created, storing the location of the database and the notes.


### Setup an admin user

A `lilt` server should have one or more admin users. To add an admin user, run the setup script again. If the `.env` file has been created, it will allow you to add one or more admin users.

### IMPORTANT - Run the cleanup script daily

In the `utils` directory is a script named `cleanup.mjs`. This will delete old usercodes, older than a week, and answers made by these old usercodes. Please setup your system to run this daily, using a tool such as `cron` on Linux or the equivalent on Windows.  **You must ensure you do this for privacy reasons as users are advised that this will be done when they sign up for a user code.**

### Start the server

Start the server with:
```
npx react-server start --port YOUR_CHOSEN_PORT
```
Port is 3000 by default.
Alternatively you can use `pnpm` rather than `npx`.

## Setup topics and exercises (tutors)

When the server is running you can access the admin section with the following RURL:

```
http://localhost:YOUR_CHOSEN_PORT/admin
```

You need to setup your modules, topics and exercises within the admin section of the application.

A number of options are available to setup modules, topics and exercises. These will be described in more detail in a later revision of this `README`.

## Write your notes (tutors)

There are two methods to write your notes, via the *inbuilt graphical editor* or *manually*.

### Using the inbuilt graphical editor

This is accessible via logging in as an administrator - more details will appear
. Notes will automatically be saved in the correct directory.

### Manually 

Alternatively you can write and save your notes manually - for example you might have a favourite third-party Markdown editor. If you do this please make sure they are saved in the correct place, so `lilt` can find them.

- Notes should be placed in the directory specified by the `RESOURCES` environment variable within your `.env` (see above).
- Within this directory you should create separate subdirectories for each module, using the module code you specify when adding a module as an admin user as the directory name.
- Then, you create numbered Markdown (`.md`) files within the module directory corresponding to each topic. The numbers correspond with the topic number, so topic 1 would be `1.md`, topic 2, `2.md` and so on. These numbers must correspond with the topic numbers you specified when you created them in the database.

### How to write your notes

You write your notes in Markdown, with custom extensions for specifying exercises and hidden content. [markdown-to-jsx](https://github.com/quantizor/markdown-to-jsx) is used. As stated above you can use the inbuilt graphical editor which will save you having to write the Markdown manually.

However, the custom extensions you will have to write manually yourself, even if using the graphical editor or a third-party Markdown editor. Here is some example Markdown with custom extensions (all of which are indicated using the symbol `@`). 

The extensions are as follows:

- `@exN` : inserts exercise N by loading it from the database.
- `@exN(M)` : inserts exercise N from the database, where attempting N depends on completion of exercise M. If exercise M hasn't been completed, exercise N will not be visible.
- `@answer(N)` : the content below the extension will be treated as the answer to exercise N. It will only be visible if exercise N has been completed.
- `@depends(N)` : the content below the extension will only be visible if exercise N has been completed, but is not treated as the answer to exercise N.
- `@public` : ends protected (`@answer` or `@depends`) content. Subsequent content will be public, and visible even if the user has not completed any exercises.

Here is some example Markdown which includes the extensions. Now the content of the Markdown explains their use.
```
# Topic 1

Welcome to Web Application Development, topic 1. The @ex1 extension below will 
insert Exercise 1 into the document at this position.

@ex1

@answer(1)

This is the answer to Exercise 1. It will only be visible when a student has 
answered Exercise 1 (note how the parameter to the @answer extension is 1) and 
an admin user has verified their answers.

@public

This paragraph is public and does not require completion of any exercises. 
The @public extension ends a previous protected block of content (a block which 
depends on exercise completion) and results in the following content being 
visible to all users.

@depends(1)

The @depends extension works in a similar way to @answer. Content below it will 
be only visible if the specified exercise has been completed (1 in this case).
 However, unlike @answer content, this content will not be marked on the 
rendered document as the answer to the given exercise. 

@ex2(1)

The @ex2 extension inserts exercise 2. Note however the parameter `(1)`. 
This means that exercise 2 depends on exercise 1: Exercise 1 must be completed 
in order for exercise 2 to be visible.

@answer(2)

Similar to `@answer(1)` above, this is the answer to exercise 2 and requires 
completion of exercise 2 to view.

@depends(2)

Some content which depends on exercise 2.

@public

Yet more public content.
```

## Users/students

On the main page, students can signup for a random and anonymous 6-digit **user code**. This identifies them as a user and allows `lilt` to determine if they have answered exercises and whether the tutor has authorised their answers.

These user codes are intended to be only usable for one week (i.e they are for the current topic only); in the `utils` directory, as stated above, there is a cleanup script which will delete answers and users older than a week **which you must set up to run daily** as discussed above.

Again the main interface will be described in a later revision of this `README`.
