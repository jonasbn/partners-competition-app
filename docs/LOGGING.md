# Logging Implementation Summary

## Overview

The Partners Competition App has comprehensive logging using Logtail/Better Stack with the following configuration:

- **Token**: set via `VITE_LOGTAIL_KEY` environment variable (see `.env` or Digital Ocean App Platform settings)
- **Endpoint**: `https://in.logs.betterstack.com`

## Logger Features

### Core Logging Methods

- `Logger.info(message, context)` - General information logs
- `Logger.warn(message, context)` - Warning messages  
- `Logger.error(message, error, context)` - Error logging with stack traces
- `Logger.debug(message, context)` - Debug information
- `Logger.flush()` - Ensures logs are sent before page unload

### Specialized Logging Methods

- `Logger.userAction(action, details)` - Track user interactions
- `Logger.performance(metric, value, context)` - Performance metrics
- `Logger.event(eventName, data)` - Application events

## Logging Integration Points

### Application Lifecycle (App.jsx)

- App startup with system info (user agent, language, viewport)
- Component mounting/unmounting
- Performance metrics for app initialization

### User Interactions

- **Theme Toggle** (SimpleThemeToggle.jsx): Logs theme changes (dark/light mode)
- **Language Selector** (LanguageSelector.jsx): Logs language changes (English/Danish)
- **Avatar Interactions** (SimpleAvatarWithHover.jsx): Logs hover events with position data

### Error Handling

- **ErrorBoundary** component catches React errors and logs them
- Wraps all major app sections (header, main content, games, charts)

### Performance Monitoring

- **SimpleGamesList.jsx**: Logs data loading times and error states
- Performance metrics for component render times

### Data Operations

- Error logging for data parsing and processing failures
- User action logging for data interactions

## Log Data Structure

All logs include:

- Timestamp (ISO format)
- Log type (user_action, performance, application_event)
- Contextual data (user agent, viewport, component info)
- Error details (stack traces, error messages)

## Testing the Logging

### Automatic Logging

1. **App Startup**: Logs automatically when app loads
2. **Theme Changes**: Toggle dark/light mode
3. **Language Changes**: Switch between English/Danish  
4. **Avatar Hovers**: Hover over any player avatar
5. **Error States**: Any React errors are automatically caught and logged

### Manual Verification

1. Check browser console for log messages (prefixed with [INFO], [WARN], [ERROR], etc.)
2. Logs are simultaneously sent to console and Logtail
3. All logs are flushed automatically on page unload

## Logtail Dashboard

- All logs are sent to Better Stack/Logtail dashboard
- Filter by log level, timestamp, or custom fields
- Search by player names, actions, or error messages
- View performance metrics and user interaction patterns

## Files Modified for Logging

### Core Logging Infrastructure

- `/src/utils/logger.js` - Logger utility class
- `/src/components/ErrorBoundary.jsx` - React error boundary

### Integration Points

- `/src/App.jsx` - Application lifecycle logging
- `/src/components/SimpleThemeToggle.jsx` - Theme change logging
- `/src/components/LanguageSelector.jsx` - Language change logging
- `/src/components/SimpleAvatarWithHover.jsx` - Avatar interaction logging
- `/src/components/SimpleGamesList.jsx` - Data loading and error logging

### Dependencies

- `@logtail/browser` package installed for Logtail integration
- Automatic log flushing on page unload event
