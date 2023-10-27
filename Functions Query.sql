USE [LawerWatch]
GO
/****** Object:  User [Maria]    Script Date: 10/27/2023 2:32:01 PM ******/
CREATE USER [Maria] WITHOUT LOGIN WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  UserDefinedFunction [dbo].[CalculateDistance]    Script Date: 10/27/2023 2:32:02 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[CalculateDistance]( @lat1 float , @long1 float , @lat2 float , @long2 float)      
RETURNS float      
      
AS   
BEGIN


   SET @lat1 = ISNULL(@lat1,0)
   SET @long1 = ISNULL(@long1,0)
   SET @lat2 = ISNULL(@lat2,0)
   SET @long2 = ISNULL(@long2,0)

   IF (@lat1 = @lat2)
   BEGIN
	Return 1
   END
      	      
   DECLARE @DegToRad float = 57.29577951
   DECLARE @Ans float = 0
   DECLARE @Miles float = 0   
      
   SET @Ans = SIN(@lat1 / @DegToRad) * SIN(@lat2 / @DegToRad) + COS(@lat1 / @DegToRad ) * COS( @lat2 / @DegToRad ) * COS(ABS(@long2 - @long1 )/@DegToRad)      
      
   SET @Miles = 3959 * ATAN(SQRT(1 - SQUARE(@Ans)) / @Ans)
      
   SET @Miles = ROUND(@Miles,2)    
   
 --  IF (@Miles <= 1)
 --  BEGIN
	--SET @Miles = 1
 --  END
      
   RETURN ABS((@Miles))      
  
END
GO
/****** Object:  UserDefinedFunction [dbo].[FCurrentOffset]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE Function [dbo].[FCurrentOffset]
(
	@UserID int
)
 Returns int
 As
 Begin

	DECLARE @UTCOffset int 
	DECLARE @UTCOffsetMin int 

	Select  @UTCOffset = Deviceutcoffset from Users  where userid = @UserID

	Return  (ABS(@UTCOffset))


 END

GO
/****** Object:  UserDefinedFunction [dbo].[FGetServername]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Function [dbo].[FGetServername]()
 Returns Varchar(400)
 As
 Begin
	Return   CASE 
					WHEN @@SERVERNAME = 'PUBSDSOL'   THEN  'https://'+'192.168.1.102/lawyerwatch/' 
					WHEN @@SERVERNAME = 'staging3'   THEN  'https://'+'staging3.sdsol.com/lawyerwatch/' 
				    ELSE
						 'https://'+'192.168.1.102/lawyerwatch/' 
				    END 
END

GO
/****** Object:  UserDefinedFunction [dbo].[FLocalToUTC]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

---
CREATE Function [dbo].[FLocalToUTC]
(
	@UTCOffset int,
	@Datetime datetime
)
 Returns datetime
 As
 Begin

	

	Return  convert(datetime, DATEADD(MINUTE,@UTCOffset, @Datetime)) 

 End
GO
/****** Object:  UserDefinedFunction [dbo].[FLocalToUTCOffset]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

---
CREATE Function [dbo].[FLocalToUTCOffset]
(
	@UserID int
)
 Returns int
 As
 Begin

	DECLARE @UTCOffset int 
	DECLARE @UTCOffsetMin int 

	Select 
		@UTCOffset = (Deviceutcoffset)*-1
		--@UTCOffsetMin = ((cast(Deviceutcoffset AS DECIMAL)/100) % 1) * 100
	from Users 
	where userid = @UserID

	IF (@UTCOffset<0)
	BEGIN
		Return  -(ABS(@UTCOffset))
	END
	ELSE
	BEGIN
		Return  (ABS(@UTCOffset))
	END


	RETURN 0

 END

GO
/****** Object:  UserDefinedFunction [dbo].[FnGetLastActiveDateTime]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE FUNCTION [dbo].[FnGetLastActiveDateTime]
(
    -- Add the parameters for the function here
    @lastActiveDate Datetime,
    @UserLanguage as VARCHAR(50) = 'en'
)

RETURNS varchar(30)
AS
BEGIN
  DECLARE @LastActivity varchar(100)
  SET @LastActivity = '';
  -- Add the T-SQL statements to compute the return value here
  DECLARE @today datetime, @nowLastActiveDate datetime
  DECLARE @years int, @months int, @days int, @hours int,  @minutes int, @seconds int, @h int, @m int, @s int 
  SELECT @today = GETUTCDATE()
  SELECT @nowLastActiveDate = DATEADD(year,  DATEDIFF(year, @lastActiveDate, @today), @lastActiveDate)
  SELECT @years = DATEDIFF(year, @lastActiveDate, @today) -  (CASE WHEN @nowLastActiveDate > @today THEN 1 ELSE 0 END)
  SELECT @months = MONTH(@today - @nowLastActiveDate) - 1
  SELECT @days = DAY(@today - @nowLastActiveDate) - 1
  SELECT @h = DATEDIFF(HOUR, @lastActiveDate, @today)
  SELECT @m = DATEDIFF(MINUTE, @lastActiveDate, @today)
  SELECT @s = DATEDIFF(SECOND, @lastActiveDate, @today)

  SET @hours = (@h%24)
  SET @minutes = (@m%60)
  SET @seconds = (@s%60)                 
  
  IF (@UserLanguage = 'en')
  BEGIN
  SET @LastActivity =
        (CASE 
            --WHEN @years = 1 THEN '1 year ago '
            --WHEN @years > 1 THEN convert(varchar(3),@years) + ' y '
            --WHEN @months = 1 THEN '1 month ago '
            --WHEN @months > 1 THEN convert(varchar(3),@months) + ' m '
			WHEN @days > 7 THEN CONVERT(nvarchar(30),@lastActiveDate, 111)
            WHEN @days = 1 THEN '1d '
            WHEN @days > 1 THEN convert(varchar(3),@days) + 'd '
			WHEN @hours = 1 THEN '1h '
            WHEN @hours > 1 THEN convert(varchar(3),@hours) + 'h '
            WHEN @minutes = 1 THEN '1m '
            WHEN @minutes > 1 THEN convert(varchar(3),@minutes) + 'm '
            WHEN @seconds = 1 THEN ' Just now '
            WHEN @seconds > 1 THEN  ' Just now '
            ELSE convert(varchar, @lastActiveDate, 101)
         END)
END
RETURN @LastActivity;
END


--SELECT Convert(varchar,GETDATE())
--select CONVERT(nvarchar(30),getdate(), 121) as isoformat
--select CONVERT(nvarchar(30),getdate(), 111) as Japanformat
--select CONVERT(nvarchar(30),getdate(), 110) as USAformat
GO
/****** Object:  UserDefinedFunction [dbo].[FnSplitComma]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[FnSplitComma] (@InStr VARCHAR(MAX))
RETURNS @TempTab TABLE
   (ids varchar(500) not null)
AS
BEGIN
    ;-- Ensure input ends with comma
    SET @InStr = REPLACE(@InStr + ',', ',,', ',')
    DECLARE @SP INT
DECLARE @VALUE VARCHAR(1000)
WHILE PATINDEX('%,%', @INSTR ) <> 0 
BEGIN
   SELECT  @SP = PATINDEX('%,%',@INSTR)
   SELECT  @VALUE = LEFT(@INSTR , @SP - 1)
   SELECT  @INSTR = STUFF(@INSTR, 1, @SP, '')
   INSERT INTO @TempTab(ids) VALUES (@VALUE)
END
    RETURN
END

GO
/****** Object:  UserDefinedFunction [dbo].[FUTCToLocal]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE Function [dbo].[FUTCToLocal]
(
	@UTCOffset int,
	@Datetime datetime
)
 Returns datetime
 As
 Begin



	Return  convert(datetime, DATEADD(MINUTE,@UTCOffset, @Datetime)) 

 End
GO
/****** Object:  UserDefinedFunction [dbo].[FUTCToLocalOffset]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE Function [dbo].[FUTCToLocalOffset]
(
	@UserID int
)
 Returns int
 As
 Begin

	DECLARE @UTCOffset int 
	DECLARE @UTCOffsetMin int 

	
	Select 
		@UTCOffset = (Deviceutcoffset /100)*1,
		@UTCOffsetMin = ((cast(Deviceutcoffset AS DECIMAL)/100) % 1) * 100
	from Users 
	where userid = @UserID

	IF (@UTCOffset<0)
	BEGIN
		Return  -((ABS(@UTCOffset)*60) + ABS(@UTCOffsetMin))
	END
	ELSE
	BEGIN
		Return  (ABS(@UTCOffset)*60) + ABS(@UTCOffsetMin)
	END

	RETURN 0
 END
GO
/****** Object:  UserDefinedFunction [dbo].[GetHttp]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE function [dbo].[GetHttp] ( @url varchar(8000) )
returns varchar(8000)
as
BEGIN
	DECLARE @win int
	DECLARE @hr int
	DECLARE @text varchar(8000)

	--EXEC @hr=sp_OACreate 'WinHttp.WinHttpRequest.5.1'
	EXEC @hr=sp_OACreate 'MSXML2.XMLHTTP'
	
	,                    @win OUT
	IF @hr <> 0
		EXEC sp_OAGetErrorInfo @win
	
	--EXEC @hr   =   sp_OASetProperty   @win,'setTimeouts','5000','5000','5000','5000'

	EXEC @hr=sp_OAMethod @win
	,                    'Open'
	,                    NULL
	,                    'GET'
	,                    @url
	,                    'false'
	
	

	IF @hr <> 0
		EXEC sp_OAGetErrorInfo @win

	EXEC @hr=sp_OAMethod @win
	,                    'Send'
	
	--SET @text = CAST(@hr as varchar)

	IF @hr <> 0
		EXEC sp_OAGetErrorInfo @win
	
	

	EXEC @hr=sp_OAGetProperty @win
	,                         'ResponseText'
	,                         @text OUTPUT

	--IF @hr <> 0
	--	EXEC sp_OAGetErrorInfo @win

	EXEC @hr=sp_OADestroy @win

	--IF @hr <> 0
	--	EXEC sp_OAGetErrorInfo @win

	RETURN @text
END
GO
/****** Object:  UserDefinedFunction [dbo].[GetTimeAgo]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE FUNCTION [dbo].[GetTimeAgo]
( 
@lastActiveDate Datetime ,
@UserLanguage as VARCHAR(50) = 'en' 

) RETURNS NVARCHAR(255)
BEGIN
	--DECLARE @lastActiveDate Datetime= '2023-10-05 11:18:29.897'

    DECLARE @time_diff INT;
    DECLARE @time_unit NVARCHAR(255);
    
	DECLARE @today datetime, @nowLastActiveDate datetime

    SET @time_diff = DATEDIFF(SECOND,CAST( @lastActiveDate as Datetime), GETUTCDATE());
	--SELECT @time_diff
    IF @time_diff < 60
	BEGIN
        SET @time_unit = CONCAT(@time_diff, ' second', CASE WHEN @time_diff <> 1 THEN 's' ELSE '' END, ' ago');
	END
    ELSE IF @time_diff < 3600
	BEGIN
        SET @time_diff = ROUND(@time_diff / 60.0,2);
        SET @time_unit = CONCAT(@time_diff, ' minute', CASE WHEN @time_diff <> 1 THEN 's' ELSE '' END, ' ago');
	END
    ELSE IF @time_diff < 86400
	BEGIN
        SET @time_diff = ROUND(@time_diff / 3600,2);
        SET @time_unit = CONCAT(@time_diff, ' hour', CASE WHEN @time_diff <> 1 THEN 's' ELSE '' END, ' ago');
	END
    ELSE IF @time_diff < 604800
	BEGIN
        SET @time_diff = ROUND(@time_diff / 86400,2);
        SET @time_unit = CONCAT(@time_diff, ' day', CASE WHEN @time_diff <> 1 THEN 's' ELSE '' END, ' ago');
	END
    ELSE IF @time_diff < 2419200
	BEGIN
        SET @time_diff = ROUND(@time_diff / 604800,2);
        SET @time_unit = CONCAT(@time_diff, ' week', CASE WHEN @time_diff <> 1 THEN 's' ELSE '' END, ' ago');
	END
    ELSE IF @time_diff < 29030400
	BEGIN
        SET @time_diff = ROUND(@time_diff / 2419200,2);
        SET @time_unit = CONCAT(@time_diff, ' month', CASE WHEN @time_diff <> 1 THEN 's' ELSE '' END, ' ago');
	END
	 ELSE
    BEGIN
        SET @time_diff = ROUND(@time_diff / 29030400.0,2); -- Use 29030400.0 for floating-point division
        SET @time_unit = CONCAT(@time_diff, ' year', CASE WHEN @time_diff <> 1 THEN 's' ELSE '' END, ' ago');
    END;
    
    RETURN @time_unit;
	--SELECT @time_unit;
END;
GO
/****** Object:  UserDefinedFunction [dbo].[GetUserRating]    Script Date: 10/27/2023 2:32:03 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

---
--select [dbo].[GetUserRating](266)
CREATE Function [dbo].[GetUserRating]
(
	@UserID   int = null
)
returns int
As
Begin
Declare @RatedByUsersCount int = 0
	Declare @TotalRating int = 0
	Declare @AverageRating DECIMAL(18,2) = 0
	DECLARE @UserType nvarchar = NULL;
	--set @UserType = (select u1.SwitchUserType from Users u1 where u1.UserID = @UserID )
	--select @RatedByUsersCount = COUNT(UserRatingId) from UserRatings where ToUserId = @UserId and RecordStatus = 'Active'
	--select @TotalRating = Sum(Rating) from UserRatings where ToUserId = @UserId and RecordStatus = 'Active'

	--set @AverageRating = @TotalRating / @RatedByUsersCount
	
	SELECT
		@AverageRating = Sum(Rating)/COUNT(UserRatingId)
	from UserRatings
	where ToUserId = @UserId 
	and UserType = 'Customer'
	and RecordStatus = 'Active'
	AND ISNULL(Rating,0)<>0
	AND ISNULL(UserType,'')<>''


	if(@AverageRating is null)
	begin
		set @AverageRating = 0
	end

	if(@AverageRating =0)
	begin
		set @AverageRating = 0
	end

	Return round(@AverageRating,0)
     
END


--SELECT * FROM UserRatings WHERE ISNULL(UserType,'')<>'' AND touserid = 272
GO
