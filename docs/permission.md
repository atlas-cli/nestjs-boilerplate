## Example usage:

Create a new permission to read any profile

```
const profileReadPermission = new Permission(
  'profile',
  PermissionAction.read,
  PermissionPosession.any,
);
```

Or you can use from string
```
const profileReadPermissionOther = Permission.fromString('profile:read:any');
```