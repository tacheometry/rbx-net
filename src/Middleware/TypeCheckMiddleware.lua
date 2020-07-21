return function(...) -- recieves type checkers
    local checks = {...}
    return function(args) -- recieves args
        for index, check in ipairs(checks) do
            if not check(args[index]) then
                return false
            end
        end

        return args
    end
end