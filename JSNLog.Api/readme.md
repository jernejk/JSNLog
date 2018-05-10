## Prepared
In `.csproj`:
``` XML
<PackageReference Include="Serilog" Version="2.6.0" />
<PackageReference Include="Serilog.AspNetCore" Version="2.1.0" />
<PackageReference Include="Serilog.Exceptions" Version="4.0.0" />
<PackageReference Include="Serilog.Settings.Configuration" Version="2.5.0" />
<PackageReference Include="Serilog.Sinks.Console" Version="3.1.1" />
<PackageReference Include="Serilog.Sinks.Seq" Version="4.0.0" />
```

In `Program.cs`:
``` CSharp
public static IConfiguration Configuration { get; } = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddJsonFile("appsettings.Local.json", optional: true) // Used for local connection strings.
    .AddJsonFile($"appsettings.{Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"}.json", optional: true)
    .AddEnvironmentVariables()
    .Build();

public static int Main(string[] args)
{
    Log.Logger = new LoggerConfiguration()
        .ReadFrom.Configuration(Configuration)
        .Enrich.WithProperty("ApplicationName", typeof(Program).Assembly.GetName().Name)
        .Enrich.WithProperty("RuntimeVersion", Environment.Version)
        .Enrich.FromLogContext()
        .WriteTo.Console()
        .CreateLogger();

    try
    {
        Log.Information("Application Started");

        BuildWebHost(args).Run();

        return 0;
    }
    catch (Exception ex)
    {
        Log.Fatal(ex, "WebApi was unable to boot!");
        return 1;
    }
    finally
    {
        Log.CloseAndFlush();
    }
}
```
In `appsettings.json`:
``` json
"Serilog": {
  "Using": [ "Serilog.Exceptions", "Serilog", "Serilog.Sinks.Console", "Serilog.Sinks.Seq" ],
  "MinimumLevel": {
    "Default": "Debug",
    "Override": {
      "Microsoft": "Information",
      "System": "Warning"
    }
  },
  "WriteTo": [
    {
      "Name": "Seq",
      "Args": {
        "serverUrl": "http://localhost:5341",
        "apiKey": "none",
        "restrictedToMinimumLevel": "Verbose"
      }
    },
    {
      "Name": "Console",
      "Args": {
        "restrictedToMinimumLevel": "Debug"
      }
    }
  ],
  "Enrich": [ "WithExceptionDetails" ],
  "Properties": {
    "Environment": "LocalDev"
  }
}
```

Step 1:
``` XML
<PackageReference Include="JSNLog.AspNetCore" Version="2.26.1" />
```

Step 2:
`Startup.cs`
``` CSharp
public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
// ...
app.UseCors(builder => builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader());

// Configure JSNLog
// See http://jsnlog.com/Documentation/Configuration/JSNLog
var jsnlogConfiguration = new JsnlogConfiguration()
{
    // Format "%message" will break logging.
    serverSideMessageFormat = "JL: %message",
};

app.UseJSNLog(new LoggingAdapter(loggerFactory), jsnlogConfiguration);
```

Step 3:
`package.json`
``` Json
"jsnlog": "^2.26.1",
```

Step 4:
`app.module.ts`
``` TypeScript
import { NgModule, ErrorHandler } from '@angular/core';
import { JL } from 'jsnlog';

// Logging stuff
class UncaughtExceptionHandler implements ErrorHandler {
  handleError(error: any) {
      JL().fatalException('Uncaught Exception', error);
      console.warn('logged');
  }
}

const logLevel = JL.getAllLevel();
const appender = JL.createAjaxAppender('example appender');
appender.setOptions({
    'bufferSize': 20,
    'storeInBufferLevel': 1000,
    'level': logLevel,
    'sendWithBufferLevel': 6000,
    'url': 'http://localhost:51213/jsnlog.logger'
});

// Configure the JSNLog logging library.
// See http://jsnlog.com/Documentation/JSNLogJs
JL().setOptions({
    'appenders': [appender],
    'level': logLevel
});

JL().info('Angular is starting...');

  providers: [
    { provide: 'JSNLOG', useValue: JL },
    { provide: ErrorHandler, useClass: UncaughtExceptionHandler }
  ],
```