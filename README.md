# lilt 2 - Lightweight Interactive Learning Tool

**Now using Markdown and [@lazarv/react-server](https://react-server.dev)!**

## What is lilt?

`lilt` is a tool to allow students to actively participate in learning sessions by means of interactive exercises. When tutors are delivering learning material via a lecture or a talk, there is always a question as to whether the students are actually understanding the content. `lilt` allows tutors to check students' understanding by integrating lecture material with interactive exercises which students can answer in class. The tutor can then view submitted answers and the submitted answers can be discussed in class, to address common misunderstandings.

`lilt` also allows tutors to hide sections of the notes until particular exercises have been answered. This allows students to think through problems themselves and suggest their own ideas before the problem is discussed through the notes.

With `lilt` 2, tutors now write code in Markdown with custom extensions to support exercises and hidden content.

## What lilt is not

First of all, a quick word on what `lilt` is not. It is not, and does not aim to be, a full Virtual Learning Environment (VLE). Students do not provide their personal details at all, providing a private and anonymous environment. `lilt` does not aim to assess students over the period of a whole module, but just aims to check their understanding of the current topic.

It's also geared at tutors who are happy using Markdown to write their notes. It does not yet support PowerPoint slides for example and may not for some considerable time.

## How to setup a lilt server

As `lilt` servers are expected to be small-scale, servicing just one class at a time, SQLite is used. An SQL setup file `setupdb.sql` is provided. Import this with the `sqlite3` client, for example:

```
sqlite3 < setupdb.sql
```

### Install dependencies and build

You need [Node.js](https://nodejs.org) - at least version 20 - installed on your system.

`lilt` uses [@lazarv/react-server](https://react-server.dev) as its web development framework. You should install the package management tool  [pnpm](https://pnpm.io).

Once installed do:

```
pnpm install
```

Then build and run: 

```
pnpm react-server build
pnpm react-server start --port YOUR_CHOSEN_PORT
```

Port is 3000 by default.

### Setup a .env file

You will need to setup a `.env` file to hold `lilt`'s settings. There are two settings:

- NOTES_DB: the location of your SQLite database.
- RESOURCES: the top-level directory holding your Markdown notes. (This directory will have one subdirectory for each module, see below).

An example is given with the `.env-example` file given in the distribution.

### Setup an admin user

A `lilt` server should have one or more admin users. These are setup by means of a utility script in `utils`, `addAdmin.mjs`. Run this with

```
node utils/addAdmin.mjs
```
to add an admin user to the database. 


### Setup topics and exercises

When the server is running you can access the admin section with

```
http://localhost:YOUR_CHOSEN_PORT/admin
```

You need to setup your modules, topics and exercises within the admin section of the application.

A number of options are available to setup modules, topics and exercises. These will be described in more detail in a later revision of this `README`.

### Write your notes

#### Where to save your notes

- Notes should be placed in the directory specified by the `RESOURCES` environment variable within your `.env` (see above).
- Within this directory you should create separate subdirectories for each module, using the module code you specify when adding a module as an admin user as the directory name.
- Then, you create numbered Markdown (`.md`) files within the module directory corresponding to each topic. The numbers correspond with the topic number, so topic 1 would be `1.md`, topic 2, `2.md` and so on. These numbers must correspond with the topic numbers you specified when you created them in the database.

#### How to write your notes

You write your notes in Markdown, with custom extensions for specifying exercises and hidden content. [markdown-to-jsx](https://github.com/quantizor/markdown-to-jsx) is used. Here is some example Markdown with custom extensions (all of which are indicated using the symbol `@`). Note how the content of the Markdown explains the extensions.

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
public.

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

So in summary:

- `@exN` : inserts exercise N.
- `@exN(M)` : inserts exercise N, where N depends on completion of M.
- `@answer(N)` : include the answer to exercise N. It will only be visible if exercise N has been completed.
- `@depends(N)` : include other content which depends on exercise N.
- `@public` : end protected content. Subsequent content will be public, and visible even if the user has not completed any exercises.

## Users/students

On the main page, students can signup for a random and anonymous 6-digit **user code**. This identifies them as a user and allows `lilt` to determine if they have answered exercises and whether the tutor has authorised their answers.

These user codes are intended to be only usable for one week (i.e they are for the current topic only); in the `utils` directory within `server` there is a cleanup script which will delete answers and users older than a week.

Again the main interface will be described in a later revision of this `README`.
