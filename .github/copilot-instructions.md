When reviewing a pull request, apply the following criteria:

## Review Focus Areas

- **Security**: Check for hardcoded secrets, input validation, auth issues
- **Performance**: Look for uses of inefficient algorithms and paradigms
- **Testing**: Ensure adequate test coverage for new functionality
- **Comment**: Verify code comments are minimal, and that any comments explain why something is done rather than explaining what the code does

## Review Style

- Be specific and constructive in feedback
- Acknowledge good patterns and solutions
- Ask clarifying questions when code intent is unclear
- Focus on maintainability and readability improvements
- Always prioritize changes that improve security, maintainability, or user experience.
- Provide migration guides for significant changes
- When providing feedback, make specific suggestions for improvement when possible
- When suggesting a code change, be specific and provide justification
- Provide links to documented best-practices when possible

## Code Review Guidelines

### Code Quality Standards

- Ensure readable, maintainable code structure
- Verify adherence to team coding standards and style guides
- Check function size, complexity, and single responsibility
- Review naming conventions and code organization
- Validate proper error handling and logging practices

### Review Communication

- Provide specific, actionable feedback with examples
- Explain reasoning behind recommendations to promote learning
- Acknowledge good patterns, solutions, and creative approaches
- Ask clarifying questions when context is unclear
- Focus on improvement rather than criticism

## Review Comment Format

Use this structure for consistent, helpful feedback:

**Issue:** Describe what needs attention
**Suggestion:** Provide specific improvement with code example
**Why:** Explain the reasoning and benefits
**Documentation:** Provide links to best-practices or other helpful documentation if applicable

## Review Labels and Emojis

- 🔒 Security concerns requiring immediate attention
- ⚡ Performance issues or optimization opportunities
- 🧹 Code cleanup and maintainability improvements
- 📚 Documentation gaps or update requirements
- ✅ Positive feedback and acknowledgment of good practices
- 🚨 Critical issues that block merge
- 💭 Questions for clarification or discussion
