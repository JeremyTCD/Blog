---
mimo_pageDescription: This article focuses on the use of semantic versioning (semver) in practice; it journeys through a software release lifecycle, providing examples of how semver should be used at each phase. This article describes the semver lifecycle.
mimo_pageTitle: The Semantic Versioning Lifecycle
mimo_pageID: the-semantic-versioning-lifecycle
mimo_date: Feb 26, 2018
mimo_fontLinks:
  - link: https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600
---

<!--
3.0.0
- Fixed bugs.
- Software finally production ready.

3.0.0-beta.2
- Fixed bugs.
- Made backward compatible changes.

3.0.0-beta.1
- Improved performance.
- Made backward incompatible changes.

3.0.0-beta.0
- Completed feature F.
- All features complete but software not been rigourously tested and optimized.

3.0.0-alpha.1
- Completed feature E.
- Made backward compatible changes.

3.0.0-alpha.0
- Removed feature A.
- Completed feature D.
- Made backward incompatible changes.

2.1.0
- Marked public API functionality as deprecated.

2.0.0
- Fixed backward incompatible bugs

1.2.0
- Made backward compatible, non-bug-fix changes to private code.

1.1.0
- Added public API functionality.

1.0.1
- Made backward compatible bug fixes.

1.0.0
- Fixed bugs, improved performance.
- Made backward incompatible changes.
- Software finally production ready.

1.0.0-beta.1
- Fixed bugs, improved performance.
- Made backward compatible changes.

1.0.0-beta.0
- Completed feature C.
- All features complete but software not rigourously tested and optimized.

1.0.0-alpha.2
- Completed feature B.
- Made backward incompatible changes.

1.0.0-alpha.1
- Completed feature A.
- Made backward compatible changes.

1.0.0-alpha.0
- Architectural plans have stabilized and features have been locked but several features are incomplete.
- Made backward incompatible changes.

0.3.0 
- Made backward incompatible changes.

0.2.0 
- Made backward compatible changes.

0.1.0 
- Initial release.
-->

<!-- TODO
- read through entire spec, make sure everything is accurate
-->


Semantic versioning (semver) is a system for versioning software. By defining a standard way to version software, semver facilitates software interoperability. The full what, why, and a detailed specification for 
this excellent system can be found at [semver.org](https://semver.org). This article focuses on the use of semver in practice; it journeys through the software versioning lifecycle, providing examples of how semver should be used in 
each phase. This article describes *the semantic versioning lifecycle*.

# Terminology
Before delving into the semver lifecycle, some terms need to be defined:

| Term | Description |
| ---- | ---------- |
| Public&nbsp;API | The *public API (public application programming interface)* of a piece of software refers to the portion of its surface area that is publically exposed for programmatic access. For example, the public API of a web service could refer to a REST API, the public API of a library could refer to its public members, and the public API of a command line application could refer to the list of commands that it accepts. |  
| Private&nbsp;code | The *private code* of a piece of software refers to code that is not publically exposed. For example, the private code of a web service could include a repository layer, the private code of a library could refer to its private classes and members, and the private code of a command line application could include business logic. |
| Version | A *version* is a snapshot of a piece of software. |
| Backward&nbsp;compatible | *Backward compatible* is an adjective for versions. A version is backward compatible if it can be used as a perfect substitute for the version that precedes it. For example, if a version only adds new features, it is backward compatible, while if a version removes or changes features, it is not backward compatible. | 
| Version&nbsp;Number | A *version number* is an identifer for a version. Version numbers are strings of the form `major.minor.patch[-pre_release_identifiers][+build_metadata]`, where `major`, `minor` and `patch` are integers, and both `pre_release_identifiers` and `build_metadata` are series of dot separated strings, with each string containing only characters in the regex character set `[0-9A-Za-z\-]`. |
| Patch version | *Path version* refers to the `patch` segment of a version number. |
| Minor version | *Minor version* refers to the `minor` segment of a version number. | 
| Major version | *Major version* refers to the `major` segment of a version number. |
| Release | A *release* is a production-ready version. |
| Pre-release | A *pre-release* is a non-production-ready version that closely precedes a release. |

> [!alert-warning]
> Semver can only be used to version software that declares a public API, such as a library. Examples of software that do not declare public APIs include many games and websites. 
> These kinds of software are typically standalone end-products that are not programmatically accessible. For such software, it is impossible to determine backward compatibility
> since 2 or more interdependent systems are required for compatibility to be determined (a standalone system has nothing to be compatible or incompatible with). Not being able to determine backward
> compatibility makes semver impossible to apply - alternative versioning systems should be used for such software.

> [!alert-note]
> The build metadata segment of a version number has no significance in the semver lifecycle; it is not discussed in this article. 

# Initial Development Phase
> [!alert-note]
> This article's focus is on the use of semver in practice. To that end, it journeys through a generic software versioning lifecycle. Don't worry about the lifecycle's specifics like its phase's names and 
> descriptions. Getting the gist of what each phase covers is enough to derive value from this article.

## Description
A piece of software is in this phase just after conception; architectural plans and feature requirements are typically in flux, development is rapid and the software's public API is very unstable. 

## Following Semver
Semver suggests beginning this phase with the version number `0.1.0`. During this phase, each subsequent version number should only have its minor version incremented, regardless
of whether or not changes are backward compatible. For example, at the end of this phase, the simplified changelog of a piece of software might look like this:

[!include-code] { 
    "src": "./the-semantic-versioning-lifecycle.md",
    "ranges": [{"start": 76, "end": 83 }],
    "highlight": false
}

> [!alert-note]
> Patch version can be incremented in this phase, however, semver [recommends](https://semver.org/#how-should-i-deal-with-revisions-in-the-0yz-initial-development-phase) only incrementing minor version for simplicity's 
> sake.

## Benefits of Following Semver
Following semver in this phase has several benefits: 
- Keeping major version at 0 is a good way of letting potential consumers know that the software is very unstable.
- Incrementing only minor version helps avoid having major version balloon from numerous backward incompatible changes.
- The simplicity of only incrementing minor version facilitates quick iterations without compromising on the availability of an ordered history.

# Pre-Release Phase

## Description
A piece of software is in this phase when it is not production ready, but is working its way toward a release; like in the initial development phase, development is rapid and 
the software's public API is very unstable. 

> [!alert-note]
> This phase and the initial development phase have somewhat similar descriptions. One might wonder, when should a piece of software transition from the initial development phase to the
> pre-release phase? Unfortunately, there is no standard way to demarcate these phases; some projects use testing stages while others use more arbitrary measures. One simple approach is to consider a piece of software to be in the 
> pre-release phase once architectural plans are stable and features are locked (features to be included in the target release have been fixed). Similarly, there is no standard way to 
> demarcate this phase's sub-phases (alpha, beta, release candidate etc). A simple approach would be to use the following markers:
> - A piece of software is in the alpha sub-phase if it is still feature incomplete (feature locked but some features have not been fully implemented). 
> - A piece of software in in the beta sub-phase if it is feature complete but not yet rigorously tested and optimized.
>
> Do note that this phase can occur after the initial development phase or a [maintenance phase](#maintenance-phase). After the initial development phase, a piece of software would 
> be working its way toward the `1.0.0` version - its first release. After a maintenance phase, a piece of software could be working toward any release, for example, `2.0.0` or `3.1.4`.

## Following Semver
During this phase, semver specifies that version numbers should be the version number of the target release followed by a `-` and dot separated pre-release identifiers, 
for example, `1.0.0-alpha.1`. Each subsequent version number should only have its pre-release identifiers incremented, regardless of whether or not changes are backward compatible. For example, at the end of this phase, 
the simplified changelog of a piece of software might look like this:

[!include-code] { 
    "src": "./the-semantic-versioning-lifecycle.md",
    "ranges": [{"start": 56, "end": 83 }],
    "highlight": false
}

## Benefits of Following Semver
Following semver in this phase has similar benefits to following semver in the initial development phase:
- Appending pre-release identifiers is a good way of letting potential consumers know that the software is not ready for use in production. 
- Incrementing only the pre-release identifiers helps avoid having major version balloon from repeated changes to the public API.
- The simplicity of only incrementing the pre-release identifiers facilitates quick iterations while not compromising on the availability of an ordered history.

# Maintenance Phase

## Description
A piece of software is in this phase when it is production ready; typically, other software have begun depending on it in production, and as a result, backward compatibility has started to matter (changing the public 
API from version to version would cause issues for other software).

## Following Semver
This phase begins with the version number of the target release that the preceding pre-release phase was working toward, for example, `1.0.0`. During this phase, the semver system specifies that version numbers 
should be incremented in the following manner:
- If a version adds only backward compatible bug fixes, its version number must be the preceding version number with its patch version incremented.
- If a version adds only backward compatible changes and at least one of these changes is not a bug-fix, its version number must be the preceding version number with its minor version incremented and its patch version set 
to 0. Examples of backward compatible, non-bug-fix changes include:
  - Adding public API functionality, for example, adding new end points to a REST API.
  - Making backward compatible, non-bug-fix changes to private code, for example, optimizing a private method in a library. 
  - Marking public API functionality as deprecated (this may result in warning messages when consumers use the software, but must not change the behaviour of the public API).
- If a version makes **any** backward incompatible changes, its version number must be the preceding version number with its major version incremented, minor version set to 0, and patch version set to 0.

> [!alert-note]
> Incrementing major version just for a small, backward incompatible change may seem unusual. Semver has good reason for this though, consider a library: some of the software that depends on 
> it would have specified that the latest version of the library with a specific major version should be installed whenever dependencies are updated, for example, the latest `5.x.x` version. By locking major 
> version, these software expect their package managers to install versions of the library that are backward compatible with the version that was developed against. If a version 
> containing backward incompatible changes is released without a corresponding major version increment, package managers wouldn't know any better and some of the software that depends on the library would break.
> 
> One way to avoid excessive major version increments would be to hold off on entering this phase. A piece of software enters this phase when it is production ready. The term *production ready* is in truth, subjective. 
> Ultimately, if other software have not begun depending on the software (and thus, changing the public API from version to version does not cause issues for other software), there is no real need to advance to the 
> maintenance phase. Staying in the pre-release phase for longer will allow kinks in the software's public API to be ironed out without major version increments. 
> 
> Another way to avoid excessive major version increments would be to batch backward incompatible changes, for example, Angular batches backward incompatible changes, releasing a new major version every few months. Of course, 
> this would mean that backward incompatible bug fixes could take longer to reach consumers, so a release cycle must be carefully planned.
> 
> Semver's FAQ also mentions the issue of major version increments, it [encourages](https://semver.org/#if-even-the-tiniest-backwards-incompatible-changes-to-the-public-api-require-a-major-version-bump-wont-i-end-up-at-version-4200-very-rapidly) 
> prudence with public API changes as a solution.

> [!alert-note]
> A typical software project has a set of files that serve as scaffolding, this set of files includes but is not limited to tests, continuous integration scripts, and configuration files. These files often have no effect on 
> the software that is actually distributed, for example, changing tests typically doesn't change the executable generated when a project is built. Semver does not mention such files, however, intuitively, changes that have
> no effect on the software that is actually distributed should not justify a new version since there would then be multiple identical versions.

At the end of a maintenance phase, the simplified changelog of a piece of software might look like this:

[!include-code] { 
    "src": "./the-semantic-versioning-lifecycle.md",
    "ranges": [{"start": 36, "end": 83 }],
    "highlight": false
}

## Benefits of Following Semver
Following semver in this phase has one key benefit: 
- Software interoperability. Many package managers support semver and many consumers expect software to follow semver.

# Coming Full Circle
At some point in a maintenance phase, the need for a rewrite might arise. A rewrite will take the project back to the pre-release phase. For example, after a second pre-release phase, the simplified changelog of a piece 
of software might look like this:

[!include-code] { 
    "src": "./the-semantic-versioning-lifecycle.md",
    "ranges": [{"start": 11, "end": 83 }],
    "highlight": false
}

Note that the second pre-release phase can take place on a separate branch so that bug fixes can continue being released on the main branch.

# Conclusion
While this article describes how software versioning should be done according to semver, ultimately, a piece of software's specific circumstances must also be taken into account. Always do what makes sense.
Thanks for reading this article, I hope it has been useful. Feel free to leave a comment below!