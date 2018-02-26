---
mimo_pageDescription: This article focuses on the use of semantic versioning in practice; it takes a journey along a generic software release lifecycle, providing examples of how to use semantic versioning along the way - thereby describing the semantic versioning lifecycle.
mimo_pageTitle: The Semantic Versioning Lifecycle
mimo_pageID: the-semantic-versioning-lifecycle
mimo_date: Feb 26, 2018
mimo_fontLinks:
  - link: https://fonts.googleapis.com/css?family=Open+Sans:400,400i,600

# Update and fix
mimo_disableComments: true
---

Semantic versioning is a system for versioning software. By defining a standardized way to version software, it facilitates interoperability between pieces of software. The full what, why, and a detailed specification for 
this excellent system can be found at [semver.org](semver.org). This article focuses on the use of semantic versioning in practice; it takes a journey along a software release lifecycle, providing examples of how semantic 
versioning should be used at each phase. This article describes *the semantic versioning lifecycle*.

# Terminology
Before delving into the semantic versioning lifecycle, it is important for some terms to be clearly defined:

| Term | Definition |
| ---- | ---------- |
| Public&nbsp;API | The *public API* of a piece of software refers to its publically exposed surface area. For instance, the public API of a web service could refer to a RESTful API, and the public API of a library could refer to a set of public members. |  
| Private&nbsp;code | The *private code* of a piece of software refers to code that is not publically exposed. For instance, the private code of a web service could refer to a repository layer, and the private code of a library could refer to its private classes and members. |
| Version | In this article, *version* refers to a specific release of a piece of software.
| Backward&nbsp;compatible | In this article, *backward compatible* is used to describe versions. A version is backward compatible if it can be used as a substitute for the version that precedes it. For instance, if a version only adds new features (with existing features remain as is), it is backward compatible. | 
| Version&nbsp;Number | In this article, a *version number* is an identifer for a version. It is of the form major.minor.patch[-pre_release_identifiers], where major, minor and patch are integers and pre_release_identifiers is a string containing only characters in the regex character set `[0-9A-Za-z\-]`. |
| Patch | If a version adds only backward compatible bug fixes, its version number must be the preceding version number with patch incremented. |
| Minor | <p>If and only if a version:</p><ul><li> adds backward compatible public API functionality and/or</li><li>makes non-bug-fix changes to private code and/or</li><li>**marks** public API functionality as deprecated,</li></ul><p>its version number must be the preceding version number with minor incremented and patch set to 0. Such a version can also contain changes that alone, would only cause patch to be incremented.</p>| 
| Major | If a version makes any backward **incompatible** changes, its version number must be the preceding version number with major incremented, minor set to 0, and patch set to 0. Such a version can also contain changes that alone, would only cause minor or patch to be incremented.|

# Rapid Development Phase
> [!alert-note]
> The goal of this article is to describe how semantic versioning should be used in practice. To this end, we will follow a simple, generic software release cycle that is sufficient to achieve the goal of this article but no
> more complicated than it needs to be.

The rapid development phase refers to the initial development phase of a project. In this phase, a project's architecture and requirements may still be in flux. Iteration cycles are short and the project's public API is 
unstable. The semantic versioning system suggests beginning this phase with version number 0.1.0. While in this phase, each subsequent version name should only have its minor version incremented, regardless
of whether or not the public API changes. For example, at the end of this phase, the version name history for a simple project might look like this:

[!include-code]{"src":"0.3.0 // Changed private code
0.2.0 // Changed public API
0.1.0 // Initial release"}

Following the convention of keeping the major version at 0 is a good way of letting potential consumers know that the project is still unstable. Additionally, it prevents the major version from ballooning due to the 
unstable public API.

# Pre-Release Phase
The pre-release phase refers to the phase where the project has become stable architecturally as well as in terms of requirements but is not yet ready for production. This phase is often subdivided into sub-phases. For 
example:
- the alpha sub-phase often refers to the phase where the project is still feature incomplete. 
- the beta sub-phase often refers to the phase where a project is feature complete but not yet rigorously tested and optimized.



# Release Phase


## Bugfixes
## Deprecation
## Addition of Backward Compatible Functionality
## non-bug-fix changes to Private Code 