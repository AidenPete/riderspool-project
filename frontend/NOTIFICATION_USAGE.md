# Modern UI Components Usage Guide

This guide explains how to use the new modern UI components added to the application.

## 🎨 Toast Notifications

Toast notifications are modern, non-intrusive alerts that appear in the top-right corner of the screen.

### How to Use

```javascript
import { toast } from '../utils/toast';

// Success notification
toast.success('Provider saved successfully!');

// Error notification
toast.error('Failed to save provider. Please try again.');

// Warning notification
toast.warning('Please complete your profile first.');

// Info notification
toast.info('Provider removed from saved list');
```

### Features
- Auto-dismisses after 4 seconds
- Stacks multiple notifications
- Smooth slide-in animation
- Manual close button
- Color-coded by type (success: green, error: red, warning: yellow, info: blue)

---

## ⏳ Loading Spinner

Use the loading spinner for async operations or page loads.

### How to Use

```javascript
import LoadingSpinner from '../components/common/LoadingSpinner';

// Simple spinner
<LoadingSpinner />

// With custom size
<LoadingSpinner size="small" />  // small, medium, large
<LoadingSpinner size="large" />

// Fullscreen loading overlay
<LoadingSpinner fullScreen={true} message="Loading providers..." />

// With message
<LoadingSpinner message="Please wait..." />
```

### Example in Component

```javascript
function MyComponent() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading data..." />;
  }

  return <div>Your content here</div>;
}
```

---

## ✅ Confirmation Modal

Beautiful confirmation dialogs for destructive or important actions.

### How to Use

```javascript
import { useState } from 'react';
import ConfirmModal from '../components/common/ConfirmModal';

function MyComponent() {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    // Perform delete action
    console.log('Deleted!');
  };

  return (
    <>
      <button onClick={handleDelete}>Delete Provider</button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete Provider"
        message="Are you sure you want to delete this provider? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        type="error"  // success, error, warning, info
      />
    </>
  );
}
```

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `isOpen` | boolean | required | Controls modal visibility |
| `onClose` | function | required | Called when modal closes |
| `onConfirm` | function | required | Called when user confirms |
| `title` | string | 'Confirm Action' | Modal title |
| `message` | string | 'Are you sure...' | Modal message |
| `confirmText` | string | 'Confirm' | Confirm button text |
| `cancelText` | string | 'Cancel' | Cancel button text |
| `type` | string | 'info' | Visual style: success, error, warning, info |
| `icon` | string | null | Custom icon (overrides default) |

---

## 🎯 Examples

### Example 1: Save Provider with Toast
```javascript
const handleSave = async () => {
  try {
    await savedProvidersAPI.saveProvider(providerId);
    toast.success('Provider saved successfully!');
  } catch (error) {
    toast.error('Failed to save provider. Please try again.');
  }
};
```

### Example 2: Delete with Confirmation
```javascript
const [showConfirm, setShowConfirm] = useState(false);

const handleDelete = async () => {
  try {
    await api.deleteItem(itemId);
    setShowConfirm(false);
    toast.success('Item deleted successfully!');
  } catch (error) {
    toast.error('Failed to delete item.');
  }
};

return (
  <>
    <button onClick={() => setShowConfirm(true)}>Delete</button>
    <ConfirmModal
      isOpen={showConfirm}
      onClose={() => setShowConfirm(false)}
      onConfirm={handleDelete}
      title="Delete Item"
      message="This action cannot be undone."
      type="error"
    />
  </>
);
```

### Example 3: Form Submission with Loading
```javascript
const [loading, setLoading] = useState(false);

const handleSubmit = async (data) => {
  setLoading(true);
  try {
    await api.submitForm(data);
    toast.success('Form submitted successfully!');
  } catch (error) {
    toast.error('Submission failed. Please try again.');
  } finally {
    setLoading(false);
  }
};

if (loading) {
  return <LoadingSpinner fullScreen message="Submitting form..." />;
}
```

---

## 🎨 Styling

All components use consistent design tokens:
- **Colors**: Blue (primary), Green (success), Red (error), Yellow (warning)
- **Animations**: Smooth cubic-bezier transitions
- **Border Radius**: 12-20px for modern look
- **Shadows**: Layered elevation system

Components are fully responsive and work on all screen sizes.
