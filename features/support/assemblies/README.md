# Test assemblies

Test assemblies extend the application's `Assembly` and adds various properties:

* `context*Port` - Use in `Given` steps. Defined in `TestAssembly` and should not be overridden.
* `action*Port` - Use in `When` steps. Defined differently in each `TestAssembly` subclass.
* `context*Store` - Use in `Then` steps. Defined differently in each `TestAssembly` subclass.