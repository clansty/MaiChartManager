namespace Sitreamai;

public class MusicXmlConverter
{
    public string Convert(Converter converter)
    {
        var chart = converter.SimaiTokenizer;

        var trackLevels = (string[])chart.SimaiTrackInformation.TrackLevels.Clone();
        var trackDecimalLevels = (string[])chart.SimaiTrackInformation.TrackDecimalLevels.Clone();
        var trackLevelIds = new int[7];
        var trackLevelActive = new bool[7];
        for (var i = 0; i < 7; i++)
        {
            trackLevelActive[i] = true;
            if (string.IsNullOrEmpty(trackLevels[i]))
            {
                trackLevelActive[i] = false;
                trackLevels[i] = "0";
            }
            else if (trackLevels[i].EndsWith('+'))
            {
                trackLevels[i] = trackLevels[i][..^1];
                if (string.IsNullOrEmpty(trackDecimalLevels[i]))
                {
                    trackDecimalLevels[i] = "6";
                }
            }
            else if (!float.TryParse(trackLevels[i], out _))
            {
                trackLevels[i] = "0";
            }
            else if (trackLevels[i].Contains('.'))
            {
                var parts = trackLevels[i].Split('.');
                trackLevels[i] = parts[0];
                trackDecimalLevels[i] = parts[1];
            }

            if (!int.TryParse(trackDecimalLevels[i], out _))
            {
                trackDecimalLevels[i] = "0";
            }

            if (!int.TryParse(trackLevels[i], out _))
            {
                trackLevels[i] = "0";
            }

            trackLevelIds[i] = GetLevelId(int.Parse(trackLevels[i]) * 10 + int.Parse(trackDecimalLevels[i]));
        }

        var sortName = chart.SimaiTrackInformation.TrackSortName;
        if (string.IsNullOrEmpty(sortName))
        {
            sortName = "A";
        }

        return $"""
                <?xml version="1.0" encoding="utf-8"?>
                <MusicData xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
                  <dataName>music{converter.MusicPadIdDx}</dataName>
                  <netOpenName>
                    <id>230922</id>
                    <str>Net230922</str>
                  </netOpenName>
                  <releaseTagName>
                    <id>4001</id>
                    <str>Ver1.40.00</str>
                  </releaseTagName>
                  <disable>false</disable>
                  <name>
                    <id>{converter.MusicIdDx}</id>
                    <str>{chart.SimaiTrackInformation.TrackName}</str>
                  </name>
                  <rightsInfoName>
                    <id>0</id>
                    <str />
                  </rightsInfoName>
                  <sortName>{sortName}</sortName>
                  <artistName>
                    <id>{converter.MusicId}</id>
                    <str>{chart.SimaiTrackInformation.TrackComposer}</str>
                  </artistName>
                  <genreName>
                    <id>101</id>
                    <str>POPSアニメ</str>
                  </genreName>
                  <bpm>{converter.Bpm}</bpm>
                  <version>22001</version>
                  <AddVersion>
                    <id>22</id>
                    <str>test</str>
                  </AddVersion>
                  <movieName>
                    <id>{converter.MusicId}</id>
                    <str>{chart.SimaiTrackInformation.TrackName}</str>
                  </movieName>
                  <cueName>
                    <id>{converter.MusicId}</id>
                    <str>{chart.SimaiTrackInformation.TrackName}</str>
                  </cueName>
                  <dresscode>false</dresscode>
                  <eventName>
                    <id>1</id>
                    <str>無期限常時解放</str>
                  </eventName>
                  <eventName2>
                    <id>0</id>
                    <str>解放なし</str>
                  </eventName2>
                  <subEventName>
                    <id>0</id>
                    <str>解放なし</str>
                  </subEventName>
                  <lockType>0</lockType>
                  <subLockType>0</subLockType>
                  <dotNetListView>true</dotNetListView>
                  <notesData>
                    <Notes>
                      <file>
                        <path>{converter.MusicPadIdDx}_00.ma2</path>
                      </file>
                      <level>{trackLevels[1]}</level>
                      <levelDecimal>{trackDecimalLevels[1]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[1]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevelActive[1] ? "true" : "false")}</isEnable>
                    </Notes>
                    <Notes>
                      <file>
                        <path>{converter.MusicPadIdDx}_01.ma2</path>
                      </file>
                      <level>{trackLevels[2]}</level>
                      <levelDecimal>{trackDecimalLevels[2]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[2]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevelActive[2] ? "true" : "false")}</isEnable>
                    </Notes>
                    <Notes>
                      <file>
                        <path>{converter.MusicPadIdDx}_02.ma2</path>
                      </file>
                <level>{trackLevels[3]}</level>
                <levelDecimal>{trackDecimalLevels[3]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[3]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevelActive[3] ? "true" : "false")}</isEnable>
                    </Notes>
                    <Notes>
                      <file>
                        <path>{converter.MusicPadIdDx}_03.ma2</path>
                      </file>
                <level>{trackLevels[4]}</level>
                <levelDecimal>{trackDecimalLevels[4]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[4]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevelActive[4] ? "true" : "false")}</isEnable>
                    </Notes>
                     <Notes>
                      <file>
                        <path>{converter.MusicPadIdDx}_04.ma2</path>
                      </file>
                <level>{trackLevels[5]}</level>
                <levelDecimal>{trackDecimalLevels[5]}</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>{trackLevelIds[5]}</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>{(trackLevelActive[5] ? "true" : "false")}</isEnable>
                    </Notes>
                    <Notes>
                      <file>
                        <path>{converter.MusicPadIdDx}_05.ma2</path>
                      </file>
                      <level>0</level>
                      <levelDecimal>0</levelDecimal>
                      <notesDesigner>
                        <id>999</id>
                        <str/>
                      </notesDesigner>
                      <notesType>0</notesType>
                      <musicLevelID>19</musicLevelID>
                      <maxNotes>0</maxNotes>
                      <isEnable>false</isEnable>
                    </Notes>
                 </notesData>
                  <utageKanjiName />
                  <comment />
                  <utagePlayStyle>0</utagePlayStyle>
                  <fixedOptions>
                    <FixedOption>
                      <_fixedOptionName />
                      <_fixedOptionValue />
                    </FixedOption>
                    <FixedOption>
                      <_fixedOptionName />
                      <_fixedOptionValue />
                    </FixedOption>
                    <FixedOption>
                      <_fixedOptionName />
                      <_fixedOptionValue />
                    </FixedOption>
                    <FixedOption>
                      <_fixedOptionName />
                      <_fixedOptionValue />
                    </FixedOption>
                  </fixedOptions>
                  <jacketFile />
                  <thumbnailName />
                  <rightFile />
                  <priority>0</priority>
                </MusicData>
                """;
    }

    public static int GetLevelId(int levelX10)
    {
        return levelX10 switch
        {
            >= 155 => 24,
            >= 150 => 23,
            >= 145 => 22,
            >= 140 => 21,
            >= 135 => 20,
            >= 130 => 19,
            >= 125 => 18,
            >= 120 => 17,
            >= 115 => 16,
            >= 110 => 15,
            >= 105 => 14,
            >= 100 => 13,
            >= 95 => 12,
            >= 90 => 11,
            >= 85 => 10,
            >= 80 => 9,
            >= 75 => 8,
            >= 0 => levelX10 / 10,
            _ => 0
        };
    }
}
